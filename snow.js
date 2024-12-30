class SnowAnimation
{
	
	sparklesheet;
	gradient = new PIXI.Graphics();
	snowman=new PIXI.Container();
  arm1=new PIXI.Graphics();
  snow=[];
	snowContainer=new PIXI.Container();
  sparks=new PIXI.Container();
	glitzer=[];
  minwidth=1200;  //this prevents that the snowman is drawn when the window does not have at least this width
  
	constructor({mydiv=document.body,doSnowman=true,doSparkles=true}={})
	{
		this.handleResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.handleResize);
		this.mydiv=mydiv;
		this.doSnowman=doSnowman;
		this.doSparkles=doSparkles;
		this.app = new PIXI.Application();
		this.run();
	}
	
	
	async setup()
	{
		await this.app.init({ background: '#021f4b', resizeTo: window });
		this.mydiv.appendChild(this.app.canvas);
		this.app.renderer.autoResize = true;
		this.width=window.innerWidth;
		this.height=window.innerHeight;
	}
  
  async preload()
  {
  	const assets = [
        { alias: 'flake1', src: 'https://live.staticflickr.com/65535/54222930325_6c802ef307_o.png' },
        { alias: 'flake2', src: 'https://live.staticflickr.com/65535/54222533406_030f86c012_o.png' },
        { alias: 'flake3', src: 'https://live.staticflickr.com/65535/54221624597_62cbca00e9_o.png' },
    ];

		await PIXI.Assets.load(assets);
	
  	const sparkleJSON=
		{
			"frames":
			{
				"sparkle2_anim1.png":
				{
					"frame": {"x":0,"y":0,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				},
				"sparkle2_anim2.png":
				{
					"frame": {"x":125,"y":0,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				},
				"sparkle2_anim3.png":
				{
					"frame": {"x":250,"y":0,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				},
				"sparkle2_anim4.png":
				{
					"frame": {"x":375,"y":0,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				},
				"sparkle2_anim5.png":
				{
					"frame": {"x":0,"y":126,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				},
				"sparkle2_anim6.png":
				{
					"frame": {"x":125,"y":126,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				},
				"sparkle2_anim7.png":
				{
					"frame": {"x":250,"y":126,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				},
				"sparkle2_anim8.png":
				{
					"frame": {"x":375,"y":126,"w":125,"h":126},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":125,"h":126},
					"sourceSize": {"w":125,"h":126}
				}
			},
			"meta":
			{
				"app": "Adobe Animate",
				"version": "24.0.7.61",
				"image": "https://live.staticflickr.com/65535/54226843686_7e04b2339f_o.png",
				"format": "RGBA8888",
				"size": {"w":512,"h":256},
				"scale": "1"
			},
			animations:
  		{
				sparkle: ['sparkle2_anim1.png','sparkle2_anim2.png', 'sparkle2_anim3.png','sparkle2_anim4.png','sparkle2_anim5.png','sparkle2_anim6.png', 'sparkle2_anim7.png','sparkle2_anim8.png'] //array of frames by name
			}
		}
		
		if(this.doSparkles)
		{
  	 await PIXI.Assets.load('https://live.staticflickr.com/65535/54226843686_7e04b2339f_o.png');
  	 this.sparklesheet = new PIXI.Spritesheet(PIXI.Texture.from(sparkleJSON.meta.image),sparkleJSON);
  	 await this.sparklesheet.parse();
  	}
  }
  
  async run()
  {
  	await this.setup();
  	await this.preload();
  	
  	this.addGradient();
		if(this.doSnowman && this.width>this.minwidth)
			this.arm1=this.addSnowman();
		
		this.addSnowflakes();
		
  	if(this.doSparkles)
  		this.addSparkles();
  	
  	let elapsed=0;
		this.arm1.direction=1;
		this.arm1.wait=0;
  	
  	this.app.ticker.add((time)=>
  	{
  		elapsed+=time.deltaTime;
	 		
	 		this.animateSnow();
	 		
			if(this.doSnowman && this.width>this.minwidth)
  			this.animateArm(elapsed);
  			
  		if(this.doSparkles)
  			this.animateSparkles(elapsed);
  			
  		if(elapsed>32000)
  	 		elapsed=0;
	  });
	  
  } //async run
	
	handleResize(event)
	{

  	this.width=window.innerWidth;
  	this.height=window.innerHeight;
  
  	//console.log("resize ",Math.random()," width ",width," height ",height);
  
  	this.app.stage.removeChild(this.gradient);
  	this.addGradient();
  
		if(this.doSnowman)
		{
	 		this.app.stage.removeChild(this.snowman);
  		this.snowman=new PIXI.Container();
  		this.arm1=new PIXI.Graphics();
	  	this.arm1.direction=1;
			this.arm1.wait=0;
  		if(this.width>this.minwidth)
   			this.arm1=this.addSnowman();
  	}
		
 		this.app.stage.removeChild(this.snowContainer);
 		this.snowContainer=new PIXI.Container();
 		this.snow=[];
 		this.addSnowflakes();
  	
  	if(this.doSparkles)
  	{
  		this.app.stage.removeChild(this.sparks);
  		this.sparks=new PIXI.Container();
  		this.glitzer=[];
  		this.addSparkles();
  	}
		
	}
	
	addSnowflakes()
	{
	
		const snowCount=200;
		const snowflakes=['flake1','flake2','flake3'];
	
		for(let i=0;i<snowCount;i++)
		{
			const snowflakeAsset=snowflakes[i%snowflakes.length];
			const flake=PIXI.Sprite.from(snowflakeAsset);
			flake.anchor.set(0.5);
			flake.speed=1+Math.random()*1;
			flake.x=Math.random()*this.width;
			flake.y=Math.random()*this.height;
			flake.scale.set(0.1+Math.random()*0.1);
			flake.alpha=0.5+Math.random()*0.5;
			
			this.snowContainer.addChild(flake);
			this.snow.push(flake);
		}
		
		this.app.stage.addChild(this.snowContainer);
	}
	
	
	addSparkles()
	{
			
 		for(let i=0;i<20;i++)
 		{
  		const anim = new PIXI.AnimatedSprite(this.sparklesheet.animations.sparkle);
  		anim.visible=false;
  		anim.x=Math.random()*this.width;
  		anim.y=0.9*this.height+Math.random()*this.height*0.1-10;
  		anim.animationSpeed = 0.05+Math.random()*0.1;
  		anim.scale.set(0.1+Math.random()*0.2);
  		anim.alpha=0.5+Math.random()*0.5;
  		anim.play();
  		this.glitzer.push(anim);
  		this.sparks.addChild(anim);
 		}
 		this.app.stage.addChild(this.sparks);
 
	}

	animateSnow()
	{
	
		this.snow.forEach((flake)=>
		{
			flake.y+=flake.speed;
			if(flake.y>this.height-Math.random()*0.08*this.height)
				flake.y=0;
		});
	}

	animateArm(elapsed)
	{
  	const speed=0.5;
		if(this.arm1.angle>30)
	  	this.arm1.direction=-1;
	 	if(this.arm1.angle<0)
	 	{
	  	this.arm1.direction=1;
	  	this.arm1.wait=1;
	 	}
	 	if((this.arm1.wait==1 && (elapsed%500)<10) || this.arm1.wait==0)
	 	{
	  	this.arm1.angle+=this.arm1.direction*speed;	
	  	this.arm1.wait=0;
	 	}
	}
	
	animateSparkles(elapsed)
	{
		if((elapsed%100)<10)
		{
	 		let random_index=[];
			let random_index1=Math.floor(Math.random()*this.glitzer.length);
			let random_index2=Math.floor(Math.random()*this.glitzer.length);
			let random_index3=Math.floor(Math.random()*this.glitzer.length);
			let random_index4=Math.floor(Math.random()*this.glitzer.length);
			let random_index5=Math.floor(Math.random()*this.glitzer.length);
			random_index.push(random_index1,random_index2,random_index3,random_index4,random_index5);
		
			for(let i=0;i<random_index.length;i++)
			{
	  		this.glitzer[random_index[i]].visible=!this.glitzer[random_index[i]].visible;
	  		if(!this.glitzer[random_index[i]].visible)
	  		{
					this.glitzer[random_index[i]].x=Math.random()*this.width;
					this.glitzer[random_index[i]].y=0.9*this.height+Math.random()*this.height*0.1-10;
				}
			}
		}
	}

	addSnowman()
	{
		const radius1=100;
		const radius2=60;
		const radius3=30;
	
		const x=this.width*0.1;
		const y_offset=this.height*0.95;
	
		const gradientFill = new PIXI.FillGradient(x, y_offset-2*radius1, x, y_offset);
  	gradientFill.addColorStop(0, 0xeeeeee);
  	gradientFill.addColorStop(0.9, 0xffffff);
	
		const ball1=new PIXI.Graphics().circle(x,y_offset-radius1,radius1).fill(gradientFill);
		const ball2=new PIXI.Graphics().circle(x,y_offset-2*radius1-radius2+20,radius2).fill({color:0xeeeeee});
		const ball3=new PIXI.Graphics().circle(x,y_offset-2*radius1-2*radius2-radius3+30,radius3).fill({color:0xeeeeee});

		this.snowman.addChild(ball1,ball2,ball3);

		//decorations
		const eyes=new PIXI.Graphics().circle(x-10,y_offset-2*radius1-2*radius2-radius3+20,4).fill({color:0x333333})
	                              .circle(x+10,y_offset-2*radius1-2*radius2-radius3+20,4).fill({color:0x333333})
	                              .circle(x,y_offset-2*radius1-2*radius2-radius3+30,5).fill({color:0xff5e00})
	                              .circle(x,y_offset-2*radius1-2*radius2+2*radius3-5,7).fill({color:333333})
	                              .circle(x,y_offset-2*radius1-2*radius2+2*radius3+30,7).fill({color:333333})
	                              .circle(x,y_offset-2*radius1-2*radius2+4*radius3+30,7).fill({color:333333})
	                              .circle(x,y_offset-2*radius1-2*radius2+5*radius3+45,7).fill({color:333333})
	                              .circle(x,y_offset-2*radius1-2*radius2+6*radius3+60,7).fill({color:333333})
	                              
		const smile=new PIXI.Graphics().arc(x, y_offset-2*radius1-2*radius2-radius3+25, 20, 0.5, 2.5).stroke({width: 3, color: 0x333333 });
  
  	this.arm1.x=x-radius2+10;
  	this.arm1.y=y_offset-2*radius1-radius2+20;
  	this.arm1.lineTo(-65,-75).stroke({width: 3, color: 0x8a5312})
       .moveTo(-45,-55).lineTo(-50,-80).stroke({width: 3, color: 0x8a5312})
       .moveTo(-30,-33).lineTo(-50,-30).stroke({width: 3, color: 0x8a5312});
  
  	const arm2_0=new PIXI.Graphics().moveTo(x+radius2-10,y_offset-2*radius1-radius2+20).lineTo(x+radius2+50,y_offset-2*radius1-radius2-50).stroke({width: 3, color: 0x8a5312 });
  	const arm2_1=new PIXI.Graphics().moveTo(x+radius2+33,y_offset-2*radius1-radius2-30).lineTo(x+radius2+60,y_offset-2*radius1-radius2-35).stroke({width: 3, color: 0x8a5312 });
  	const arm2_2=new PIXI.Graphics().moveTo(x+radius2+20,y_offset-2*radius1-radius2-16).lineTo(x+radius2+15,y_offset-2*radius1-radius2-40).stroke({width: 3, color: 0x8a5312 });
  	const arm2=new PIXI.Container();
  	arm2.addChild(arm2_0,arm2_1,arm2_2);
  
  	const hat=new PIXI.Graphics().rect(x-30,y_offset-2*radius1-2*radius2-radius3+3,60,4).fill({color:333333})
                               .rect(x-20,y_offset-2*radius1-2*radius2-radius3-50+3,40,50).fill({color:333333});
  
		this.snowman.addChild(eyes,smile,this.arm1,arm2,hat);
	
		this.app.stage.addChild(this.snowman);
	
		return this.arm1;
	
	}

	addGradient()
	{
  	const gradientFill = new PIXI.FillGradient(0, 0, 0, this.height);
  	gradientFill.addColorStop(0, '#000022');
  	gradientFill.addColorStop(0.2, '#000066');
  	gradientFill.addColorStop(0.4, '#0000aa');
  	gradientFill.addColorStop(0.6, '#0055cc');
  	gradientFill.addColorStop(0.9, '#ffffff');

		this.gradient.rect(0, 0, this.width, this.height).fill(gradientFill);
  
  	this.app.stage.addChild(this.gradient);
	}

	
} //class Snow

const myAni=new SnowAnimation({mydiv: document.getElementById('javascript'), doSnowman: true, doSparkles: false});

