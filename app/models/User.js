/*
* Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
*/

'use strict';

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({
	id: 		  ObjectId, 
	username:     String,
	password:     String,
	userType:     Number,
	cellType:     Number,
	phoneId:      String
});

module.exports = mongoose.model('User', User);
