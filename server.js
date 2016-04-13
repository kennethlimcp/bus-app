var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var os = require('os');

// get an instance of router
var removeRouter = express.Router();

var busCountJson = {
	"bus-stop-111111":
	{
		"bus-05":1,
		"bus-12":1,
		"bus-24":1
	},
	"bus-stop-222222":
	{
		"bus-05":1,
		"bus-12":1,
		"bus-24":1
	}
};

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(function (req, res, next){
	res.set('X-Powered-By', 'bus app');
	next();
});

app.use('/remove',removeRouter);

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

app.get('/summary', function(req, res){
	res.json(busCountJson);
	console.log("new busCount req");
});

//get a full list of bus stop
app.get('/summary/:bus', function(req, res){
	//res.json(Object.keys(busCountJson));
	var resJson = {};
	var bus = req.params.bus;

	for(busStop in busCountJson){
		if(busCountJson[busStop].hasOwnProperty(bus)) {
			resJson[busStop] = busCountJson[busStop][bus];
		}
	}

	res.json(resJson);
	console.log('get bus summary', resJson);
});

//get a full list of bus stop
app.get('/busstop', function(req, res){
	res.json(Object.keys(busCountJson));
	console.log("new bus stop req");
});

//get the bus count for a particular bus stop
app.get('/buscount/:busstop', function(req, res){
	reqBusStop = req.params.busstop;

	if(busCountJson.hasOwnProperty(reqBusStop)){
		res.send(busCountJson[reqBusStop]);
	}
	else
		res.send("invalid bus stop");
});

app.delete('/clearall', function(req, res){
	busCountJson = {};
	res.json(busCountJson);
	console.log("bus data is cleared");
});

// check for the 'bus_stop' param only for /remove route
removeRouter.param('bus_stop', function(req, res, next, bus_stop) {
	var reqBusStop = req.params.bus_stop;
	console.log(reqBusStop);

	if(!busCountJson.hasOwnProperty(reqBusStop)) {
			res.send("bus stop not found");
			console.log("bus stop not found");
	}
	else {
	 req.bus_stop = bus_stop;
  next();
	}
});

// check for the 'bus' param only for /remove route
removeRouter.param('bus', function(req, res, next, bus) {
	var reqBus = req.params.bus;

	if(!busCountJson[req.bus_stop].hasOwnProperty(reqBus)) {
			res.send("bus not found");
			console.log("bus not found");
	}
	else {
	 req.bus_id = bus;
  next();
	}
});

removeRouter.delete('/:bus_stop', function(req, res){
	var reqBusStop = req.bus_stop;

	res.send(reqBusStop + " is removed");
	delete busCountJson[reqBusStop];
	console.log(reqBusStop + " is removed");

});

removeRouter.delete('/:bus_stop/:bus', function(req, res){
	var reqBusStop = req.bus_stop,
		reqBus = req.bus;

			res.send(reqBus + " is removed");
			delete busCountJson[reqBusStop][reqBus];
});

app.get('*', function(req, res) {
	console.log("invalid request to -",req.originalUrl);
 res.status(404).json({ error: '404', description: 'invalid url'});
});

var server = app.listen(80, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App is listening at http://%s:%s', host, port)
})
