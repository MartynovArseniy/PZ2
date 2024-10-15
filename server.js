'use strict';
var http = require('https');
var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);
