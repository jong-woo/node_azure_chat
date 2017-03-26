var http = require('http');
var PORT = 3000;

http.createServer(function(req, res) {
	res.writeHead(200, {'Content-type':'text/html'});
	res.write('<h1>Hello NodeJS</h1>');
	res.end();
}).listen(PORT);

