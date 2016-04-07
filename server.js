var express = require('express')
var app = express();
var bodyParser = require('body-parser');

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser());
app.use(express.static(__dirname));

app.post('/', function(req, res){
	res.send(req.body);
	console.log("received a POST!");
});

var server = app.listen(80, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App is listening at http://%s:%s', host, port)
})
