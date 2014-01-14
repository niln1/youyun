/*
* Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
*/


var Schema = require('jugglingdb').Schema;
var schema = new Schema('rethink', {
	debug: true,
	host: process.env.RDB_HOST || 'localhost',
	port: parseInt(process.env.RDB_PORT) || 28015,
	database: process.env.RDB_DB || 'youyun_development',
	poolMin: 1,
	poolMax: 100
});


// simplier way to describe model
var User = schema.define('Users', {
	id: 		  String, 
	uName:        String,
	password:     String,
	uType:     	  Number,
	cellType:     Number,
	phoneId:      String
});

var StudentWeeklyReport = schema.define('StudentWeeklyReports', {
	id: 		  String, 
	uid:          String,
	timestamp:    { type: Number,  default: Date.now },
	data:     	  Number
});

var StudentParent = schema.define('Student-Parent', {
	id: 		  String, 
	sid:          String,
	pid:          String
});

var UserClass = schema.define('User-Class', {
	id: 		  String, 
	uid:          String,
	cid:          String
});

var Message = schema.define('Messages', {
	id: 		  String, 
	uid:          String,
	message:      String,
	timestamp:    { type: Number,  default: Date.now },
	flag:         Boolean
});

var Reminder = schema.define('Reminders', {
	id: 		  String, 
	uid:          String,
	message:      String,
	timestamp:    { type: Number,  default: Date.now }
	flag:         Boolean
});

var Alert = schema.define('Alerts', {
	id: 		  String, 
	uid:          String,
	message:      String,
	timestamp:    { type: Number,  default: Date.now }
	flag:         Boolean
});