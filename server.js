var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var os = require('os');


var busCountJson = {
	"bus-stop-123456":
		{
			"bus-05":1,
			"bus-12":1,
			"bus-24":1
		},
	"bus-stop-888888":
		{
				"bus-05":1,
				"bus-12":1,
				"bus-24":1
			}
		};

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname));

app.post('/', function(req, res){
 res.redirect('/thankyou.html');

	reqBodyData = req.body;

	if(Object.keys(reqBodyData).length == 0)
		console.log("received an empty request!");
	else {
		var busList = Object.keys(reqBodyData);
		var busStopId = reqBodyData["busStopId"];

		console.log("busStopID", busStopId);
		if(!busCountJson.hasOwnProperty(busStopId))
			busCountJson[busStopId] = {};

			var currentBusStopJson = busCountJson[busStopId];
			var busStopBusJson = {};

		busList.forEach(function(bus){
			if(bus !== "busStopId"){
				if(currentBusStopJson.hasOwnProperty(bus))
					currentBusStopJson[bus] += 1;
				else{
					currentBusStopJson[bus] = 1;
				}
			}
		});

		console.log("new req: ",busCountJson);
	}
});

//this will return us the n/w reacheable address
app.get('/pubip', function(req, res){
	var response = [];
	var networkInterfaces = os.networkInterfaces();

	nwInterfaces = Object.keys(networkInterfaces);
	//console.log(Object.keys(networkInterfaces));
	for(i=0;i< nwInterfaces.length;i++){
		if(nwInterfaces[i] === "wlan1"){
			wlan1Info = networkInterfaces[nwInterfaces[i]];
			//console.log(networkInterfaces[nwInterfaces[i]]);
			for(a=0;a< wlan1Info.length;a++){
				if(wlan1Info[a].family === "IPv4"){
					response.push(wlan1Info[a].address);
					//console.log(wlan1Info[a].address);
					break;
				}
			}
		}
	}
	res.json(response);
});

app.get('/buscount', function(req, res){
	res.json(busCountJson);
	console.log("new busCount req");
});

app.get('/busstopid', function(req, res){
	res.json(Object.keys(busCountJson));
	console.log("new bus stop req");
});

app.get('/clearallthebuscounter/:busstopid', function(req, res){
	reqBusStopID = req.params.busstopid;

	if(busCountJson.hasOwnProperty(reqBusStopID)){
		res.send("cleared");
		busCountJson[reqBusStopID] = {};
		console.log(reqBusStopID + " is cleared");
	}
	else {
		res.send("bus stop not found");
		console.log("bus stop not found");
	}
});

app.get('/clearallthebuscounter', function(req, res){
	busCountJson = {};
	res.send(busCountJson);
	console.log("busCount is cleared");
});

var server = app.listen(80, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App is listening at http://%s:%s', host, port)
})
