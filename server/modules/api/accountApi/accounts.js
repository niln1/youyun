/*
 * file: accounts.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var auth = require('../../../middlewares/auth');
var nconf = require('nconf');

var apiServer = require('../utils/apiServer');

exports.login = function(req, res) {
    auth.doLogin(req, res);
};

exports.logout = function(req, res) {
    req.session.user = null;
    res.json({
        source: nconf.get('SERVER_NAME'),
        message: 'User successfully logged out',
        result: true,
        description: 'User successfully logged out'
    });
};

exports.getUser = function(req, res) {
	if(req.session.user){
		sendSessionUser(req,res);
	}else{
		var e = "invalid user session";
		apiServer.sendError(e);
	}
};

function sendSessionUser(req, res) {
	res.json({
		message: req.session.user,
		result: true,
		description: 'User Information in Session',
		source: nconf.get('SERVER_NAME')
	});
}