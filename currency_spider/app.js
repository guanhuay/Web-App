var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var async = require('async');
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var port = process.env.PORT || 3000;
var app = express();
var schedule = require('node-schedule');
var pageUrls = [];
var query = [];
var CADCurrency = "";

app.set('view engine', 'ejs');

const BASE_URL = "http://www.boc.cn/sourcedb/whpj/";
pageUrls.push(BASE_URL + 'enindex.html');
pageUrls.push(BASE_URL + 'enindex_1.html');
pageUrls.push(BASE_URL + 'enindex_2.html');
pageUrls.push(BASE_URL + 'enindex_3.html');
pageUrls.push(BASE_URL + 'enindex_4.html');

// time task
var rule = new schedule.RecurrenceRule();
// rule.hour = 21;
// rule.minute = 0;
// rule.second = 0;
rule.second =[0,10,20,30,40,50];

var j = schedule.scheduleJob(rule, function() {
	// getData();
	getMostUpdatedCAD();
});

app.get('/', function(req, res, next) {

	res.render('home', {
		currency : CADCurrency
	});
});

var getMostUpdatedCAD = function() {
	superagent.get(pageUrls[0]).end(function(err, res) {
		if(err) {
			return err;
		}
		var $ = cheerio.load(res.text);
		var extractedDOM = $('tbody tr[align = "center"]');

		var tempArr = extractedDOM.text().split('\n');
		CADCurrency = tempArr[32].trim();
	})
}

var getData = function() {
	pageUrls.forEach(function(pageUrl){
		superagent.get(pageUrl).end(function(err, res) {
			if(err) {
				return err;
			}
			var $ = cheerio.load(res.text);
			var extractedDOM = $('tbody tr[align = "center"]');

			// DateTime value, to be used as unique id
			var tempArr = extractedDOM.text().split('\n');
			var dateTime = tempArr[7].trim() + ' ' + tempArr[8].trim();
			var timeId = new Date(dateTime).valueOf();
			var data = [];

			extractedDOM.each(function(index, element) {
				var valArray = $(this).text().split('\n');
				var currency = {
					"Currency Name" : valArray[1].trim(),
					"Buying Rate" : valArray[2].trim(),
					"Cash Buying Rate" : valArray[3].trim(),
					"Selling Rate" : valArray[4].trim(),
					"Cash Selling Rate" :valArray[5].trim(),
					"Middle Rate" : valArray[6].trim(),
					"DateTime" : dateTime
				}
				data.push(currency);
			});
			var arrObj = {timeId, data};
			query.push(arrObj);
		});
		var JSONObj = JSON.stringify({query});
		console.log(JSONObj);			
	});
}

app.listen(port, function() {
	console.log('app is listening on port ' + port);
});

// ep.after('currency_html', pageUrls.length, function(currencies) {
// 	currencies = currencies.map(function(res) {
// 		var $ = cheerio.load(res);
// 		var extractedDOM = $('tbody tr[align = "center"]');

// 		// DateTime value, to be used as unique id
// 		var tempArr = extractedDOM.text().split('\n');
// 		var dateTime = tempArr[7].trim() + ' ' + tempArr[8].trim();
// 		var timeId = new Date(dateTime).valueOf();
// 		var data = [];
// 		extractedDOM.each(function(index, element) {

// 			var valArray = $(this).text().split('\n');
// 			var currency = {
// 				"Currency Name" : valArray[1].trim(),
// 				"Buying Rate" : valArray[2].trim(),
// 				"Cash Buying Rate" : valArray[3].trim(),
// 				"Selling Rate" : valArray[4].trim(),
// 				"Cash Selling Rate" :valArray[5].trim(),
// 				"Middle Rate" : valArray[6].trim(),
// 				"DateTime" : dateTime
// 			}
// 			data.push(currency);
// 		});
// 		var arrObj = {timeId, data};
// 		query.push(arrObj);
// 	})
// 	var JSONObj = JSON.stringify({query});
// 	console.log(JSONObj);
// });

// app.get('/', function(req, res, next) {
// 	pageUrls.forEach(function(pageUrl){
// 		superagent.get(pageUrl).end(function(err, res) {
// 			if(err) {
// 				return next(err);
// 			}
// 			ep.emit('currency_html', res.text);
// 		});
// 	});
// 	res.send("hello");
// });

// var getData = function() {
// 	pageUrls.forEach(function(pageUrl){
// 		superagent.get(pageUrl).end(function(err, res) {
// 			if(err) {
// 				return next(err);
// 			}
// 			ep.emit('currency_html', res.text);
// 		});
// 	});
// }
