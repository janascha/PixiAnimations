const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (req, res) {
    // Map the requested URL to a file on the server
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Determine the content type based on the file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html'; // Default content type
    switch (extname) {
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }

    // Check if the file exists
    fs.exists(filePath, (exists) => {
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Server Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
}).listen(8080, () => {
    console.log('Server running at http://127.0.0.1:8080/');
});
