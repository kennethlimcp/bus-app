'use strict';

var serialPortLib = require('serialport');
var serialPort = serialPortLib.SerialPort;
var request = require('request');
var _ = require('lodash');
var when = require('when');
var sequence = require('when/sequence');


var portName = '/dev/cu.usbmodem1411';
var dataUrl = 'http://KENMBP.local/';
var busData = {};

serialPortLib.list(function (err, ports) {
		console.log('\nAvailable serial ports:');
  ports.forEach(function(port) {
    console.log(port.comName);
  });
		console.log();
});

var port = new serialPort(portName, {}, false);

function openPort() {
	port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
	});
}

port.on('open', function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
		else {
			return console.log('connected to Arduino');
		}
});

port.on('data', function (data) {
 // console.log('Data: ' + data);
});

port.on('close', function () {
  console.log('Connection closed');
});

function pollBusStats(bus) {
	var dfd = when.defer();

			request({
		    method: 'get',
						uri: dataUrl + 'summary/' + bus
					}, function (error, response, body) {
		  //Check for error
		  if(error) {
		  	console.log('Error:', error);
					return dfd.reject(error);
		  }
				if(body) {
					var state = JSON.parse(body);
					busData = state;
					console.log('pollBusStats: ', busData);
					dfd.resolve(body);
				}

			});

	return dfd.promise;
}

function clearAllStats() {
	request({
    method: 'delete',
				uri: dataUrl + 'clearall'
			}, function (error, response, body) {
  //Check for error
  if(error) {
  	return console.log('Error:', error);
  }
	});
}

function removeBusStop(busStop) {
	console.log(busStop);
	request({
    method: 'delete',
				uri: dataUrl + 'remove/' + busStop
			}, function (error, response, body) {
  //Check for error
  if(error) {
  	return console.log('Error:', error);
  }
		console.log(body);
	});
}

function writeToPort(data) {
	port.write(data, function(err, bytesWritten) {
		if (err) {
				return console.log('Error: ', err.message);
		}
	});
}

function busDispatchAlgorithm() {
	if (_.isEmpty(busData)) {
		writeToPort('express route');
		console.log('Route 1');
	}
	else {
		writeToPort('normal route');
		console.log('Route 2');
	}
}

function mainApp() {
	sequence ([
		function() {
			return pollBusStats('bus-05');
		},
		function() {
			busDispatchAlgorithm();
		},
		function() {
			clearAllStats();
		}])
}


openPort();
var pollBus = setInterval(mainApp, 10000);	//get stats from service
