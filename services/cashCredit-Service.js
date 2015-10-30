var UserQuery = require('../model/queries/user-query');
var moment = require('moment-timezone');
var async = require('async');
var https = require('https');
var uuid = require('uuid');
var js2xmlparser = require("js2xmlparser");
var Client = require('node-rest-client').Client;


exports.requestLoan = function(req, callback) {
	var dateTime = moment().tz(process.env.TZ).format('DD.MM.YYYY HH:mm:ss').substring(0,19);;
	console.log(dateTime);	
	var xmlPayload = {
		SYSTEMID    : 'AMDOCS' ,
		REQUESTID   :  uuid.v1().replace(/-/g,'') ,
		TIMESTAMP   : dateTime ,
		COMMAND     : 'REQUESTLOAN' ,
		PID         :  '431276122',
		MSSIDN      :  '+359878786534', 
		TOTALAMOUNT :  '240',
		INSTNUM     :  '3',
		INSTTYPE    :  'M',
	};

	console.log(js2xmlparser("DATA", xmlPayload));

	var args = {
		data:  js2xmlparser("DATA", xmlPayload) ,
		headers:{ 'Content-Type': 'text/xml' , 'Accept-Charset' : 'UTF-8' }
	};

	console.log(args);
	var client = new Client();
	client.post('http://212.36.7.118:4444/WSP_1008', args, function(data,response) {
		console.log(data);
        callback(null,data);
	});
};

exports.requestDecision = function(req, callback) {
	var dateTime = moment().tz(process.env.TZ).format('DD.MM.YYYY HH:mm:ss').substring(0,19);;
	console.log(dateTime);
	var xmlPayload = {
		SYSTEMID    : 'AMDOCS' ,
		REQUESTID   :  uuid.v1().replace(/-/g,'') ,
		TIMESTAMP   : dateTime ,
		COMMAND     : 'REQUESTDECISION' ,
		PID         :  '431276122',
		MSSIDN      :  '+359878786534', 
	};

	console.log(js2xmlparser("DATA", xmlPayload));

	var args = {
		data:  js2xmlparser("DATA", xmlPayload) ,
		headers:{ 'Content-Type': 'text/xml' , 'Accept-Charset' : 'UTF-8' }
	};

	console.log(args);
	var client = new Client();
	client.post('http://212.36.7.118:4444/WSP_1008', args, function(data,response) {
		console.log(data);
        callback(null,data);
	});
};

exports.loanConfirm = function(payload, callback){

	var dateTime = moment().tz(process.env.TZ).format('DD.MM.YYYY HH:mm:ss').substring(0,19);;
	console.log(dateTime);
	var xmlPayload = {
		SYSTEMID    : 'AMDOCS' ,
		REQUESTID   :  uuid.v1().replace(/-/g,'') ,
		TIMESTAMP   : dateTime ,
		COMMAND     : 'REQUESTDECISION' ,
		PID         :  payload.phoneID,
		MSSIDN      :  "+" + payload.countryCode + payload.phoneID
	};

	console.log(js2xmlparser("DATA", xmlPayload));

	var args = {
		data:  js2xmlparser("DATA", xmlPayload) ,
		headers:{ 'Content-Type': 'text/xml' , 'Accept-Charset' : 'UTF-8' }
	};

	console.log(args);
	var client = new Client();
	client.post('http://212.36.7.118:4444/WSP_1008', args, function(data,response) {
		console.log(data);
		callback(null,data);
	});
};
