
var fs = require('fs');
var http = require('http');
var marked = require('marked');
var express = require('express');

var app = express();
app.disable('x-powered-by'); // for security

app.use(express.static(__dirname + '/public'));

// Rout to CV
app.get('/test.md', function(req, res) {
    var file = fs.readFile('test.md', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
            res.status(404).end('Page not found!');
        }
        res.end(marked(data.toString()));
    });
});

var server = http.createServer(app);
server.listen(8080);


