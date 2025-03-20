class Diagonals
{
	superCont=new PIXI.Container();
	gradient = [];
	N=100;
	extrawidth=1.5;
	
	constructor({mydiv=document.body}={})
	{
		this.mydiv=mydiv;
		this.app = new PIXI.Application();
		this.run();
		
		this.handleResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.handleResize);
		
		this.rotate=30; //degree
		this.startCol="ff00f7";
		this.endCol="021f4b";
	}
	
	getDimensions()
	{
		//check for mobile device or small screen
		this.N=100;
		this.extrawidth=1.5;
		
		if(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || this.width<768 || this.height>this.width)
		{
			this.N=20;
			this.extrawidth=1.7;
			if(this.width<500 || this.height>this.width)
				this.extrawidth=2.0;
		}
		
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
			{ alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
		];
		
		await PIXI.Assets.load(assets);
	}
	
	async run()
	{
		await this.setup();
		await this.preload();
		
		this.getDimensions();
		this.makeGradient(this.N);
		this.app.stage.addChild(this.superCont);
		
		var lines=this.makeGrid();
		this.superCont.x=this.width/2;
		this.superCont.y=this.height/2;
		this.superCont.addChild(lines);
		
		//rotate the grid
		this.app.ticker.add((time)=>
		{
			this.superCont.angle+=0.1;
		});
		
		this.distort();
		
	}//async run
	
	handleResize(event)
	{
		this.width=window.innerWidth;
		this.height=window.innerHeight;
		
		this.getDimensions();
		this.gradient=[];
		this.makeGradient(this.N);
		var lines=this.makeGrid();
		this.superCont.x=this.width/2;
		this.superCont.y=this.height/2;
		this.superCont.removeChildren();
		this.superCont.addChild(lines);
	}
	
	distort()
	{
		const sprite = PIXI.Sprite.from('displacement');
		sprite.texture.baseTexture.wrapMode = 'clamp';
		const filter = new PIXI.DisplacementFilter({sprite,scale: 50,});
		this.app.stage.filters = [filter];
	}
	
	makeGradient(steps)
	{
		let startRGB = this.hexToRgb(this.startCol);
		let endRGB = this.hexToRgb(this.endCol);
		for (let i = 0; i < steps; i++)
		{
			let r = Math.round(startRGB.r + (i / (steps - 1)) * (endRGB.r - startRGB.r));
			let g = Math.round(startRGB.g + (i / (steps - 1)) * (endRGB.g - startRGB.g));
			let b = Math.round(startRGB.b + (i / (steps - 1)) * (endRGB.b - startRGB.b));
			this.gradient.push(this.rgbToHex(r, g, b));
			//if(steps<20) console.log("i ",i," r g b ",r," ",g," ",b);
		}
	}
	
	makeGrid()
	{
		var lines=new PIXI.Graphics();
		
		lines.x=0;
		lines.y=0;
		
		var len=Math.max(this.height,this.width)/2*1.2;
		var x=this.width*this.extrawidth/this.N;
		
		//draw the positive lines
		for(let i = 0; i < this.N/2; i++)
		{
			lines.moveTo(i * x, -len).lineTo(i * x, len);
			lines.stroke({ color: this.gradient[this.N/2+i], pixelLine: true, width: 1 })
		}
		//draw the negative lines
		for(let i = 0; i < this.N/2; i++)
		{
			lines.moveTo(i * (-x), -len).lineTo(i * (-x), len);
			lines.stroke({ color: this.gradient[this.N/2-i-1], pixelLine: true, width: 1 })
			//the gradient is reversed since the lines are drawn from inside out!
		}
		
		lines.angle=this.rotate;
		return lines;
	}
	
	hexToRgb(hex)
	{
		let r = parseInt(hex.substring(0, 2), 16);
		let g = parseInt(hex.substring(2, 4), 16);
		let b = parseInt(hex.substring(4, 6), 16);
		return { r, g, b };
	}
	
	rgbToHex(r, g, b)
	{
		return ("#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0"));
	}
	
}

const myAni=new Diagonals({mydiv: document.body});
