var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var async = require('async');
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
var app = express();
var ep = new eventproxy();

var port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

// set up firebase
var firebase = require("firebase");
var config = {
	apiKey: "AIzaSyD8perbn1-eXCZw0GUWYz-2eSytT94ZH7Q",
	authDomain: "icurrency-currency-data.firebaseapp.com",
	databaseURL: "https://icurrency-currency-data.firebaseio.com",
	storageBucket: "",
};
firebase.initializeApp(config);
var db = firebase.database();
var ref = db.ref("/");

// url
var pageUrls = [];
var query = [];
const BASE_URL = "http://www.boc.cn/sourcedb/whpj/";
pageUrls.push(BASE_URL + 'enindex.html');
pageUrls.push(BASE_URL + 'enindex_1.html');
pageUrls.push(BASE_URL + 'enindex_2.html');
pageUrls.push(BASE_URL + 'enindex_3.html');
pageUrls.push(BASE_URL + 'enindex_4.html');

// time task
var rule = new schedule.RecurrenceRule();
rule.hour = [0, 11, 23];
// rule.hour = 21;
// rule.minute = 0;
// rule.second = 0;
// rule.second =[0,10,20,30,40,50];

var timeIdMap = new Map();

var j = schedule.scheduleJob(rule, function() {
	getData();
});

var getData = function() {
	pageUrls.forEach(function(pageUrl){
		superagent.get(pageUrl).end(function(err, res) {
			if(err) {
				return err;
			}
			console.log('Currently fetch ' + pageUrl + ' successful');
			ep.emit('query_html', [pageUrl, res.text]);
		});		
	});

	ep.after('query_html', pageUrls.length, function(currencies) {
		currencies = currencies.map(function(currenciesPairs) {
			var pageUrl = currenciesPairs[0];
			var pageHtml = currenciesPairs[1];
			
			var $ = cheerio.load(pageHtml);
			var extractedDOM = $('tbody tr[align = "center"]');

			// DateTime value, to be used as unique id
			var tempArr = extractedDOM.text().split('\n');
			var dateTime = tempArr[7].trim() + ' ' + tempArr[8].trim();
			var timeId = new Date(dateTime).valueOf();
			var data = [];
			if(!timeIdMap.has(timeId)) {
				timeIdMap.set(timeId, 1);
			}
			console.log(timeIdMap);
			if(timeIdMap.has(timeId)) {
				if(timeIdMap.get(timeId) === 1) {
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
					timeIdMap.set(timeId, 1000);
					console.log(timeIdMap);
				}
			}
		});
		var queryObj = {query};
		console.log(queryObj);
		if(query != []) {
			ref.set(queryObj);
		} 
	});
	return;	
}

app.get('/', function(req, res, next) {
	res.render('home');
});

app.listen(port, function() {
	console.log('app is listening on port ' + port);
});

	// var refquery = db.ref("/query");
	// refquery.once('value').then(function(snapshot) {
	// 	var res = snapshot.val();
	// 	for(var i=0; i< res.length; i++) {
 // 			timeidSet.add(res[i].timeId);
 // 		}
	// }).catch(function(error) {
 //    	console.log('There has been a problem with your fetch operation.');
	// });

// var getData = function() {

// 	var refquery = db.ref("/query");
// 	refquery.once('value').then(function(snapshot) {
// 		var res = snapshot.val();
// 		for(var i=0; i< res.length; i++) {
//  			timeidSet.add(res[i].timeId);
//  		}
// 	}).catch(function(error) {
//     	console.log('There has been a problem with your fetch operation.');
// 	});

// 	console.log(timeidSet);

// 	pageUrls.forEach(function(pageUrl){
// 		superagent.get(pageUrl).end(function(err, res) {
// 			if(err) {
// 				return err;
// 			}
// 			var $ = cheerio.load(res.text);
// 			var extractedDOM = $('tbody tr[align = "center"]');

// 			// DateTime value, to be used as unique id
// 			var tempArr = extractedDOM.text().split('\n');
// 			var dateTime = tempArr[7].trim() + ' ' + tempArr[8].trim();
// 			var timeId = new Date(dateTime).valueOf();
// 			var data = [];

// 			if(!timeidSet.has(timeId)) {
// 				extractedDOM.each(function(index, element) {
// 					var valArray = $(this).text().split('\n');
// 					var currency = {
// 						"Currency Name" : valArray[1].trim(),
// 						"Buying Rate" : valArray[2].trim(),
// 						"Cash Buying Rate" : valArray[3].trim(),
// 						"Selling Rate" : valArray[4].trim(),
// 						"Cash Selling Rate" :valArray[5].trim(),
// 						"Middle Rate" : valArray[6].trim(),
// 						"DateTime" : dateTime
// 					}
// 					data.push(currency);
// 				});
// 				var arrObj = {timeId, data};
// 				query.push(arrObj);
// 			}
// 		});		
// 	});
// 	var queryObj = {query};
// 	console.log(queryObj);
// 	ref.set(queryObj);
// 	return;	
// }
