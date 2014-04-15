/*
 * file: accounts.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var nconf = require('nconf');
var auth = require('../../../middlewares/auth');
var apiServer = require('../utils/apiServer');

exports.login = function(req, res) {
    auth.doLogin(req, res);
};

exports.logout = function(req, res) {
    req.session.user = null;
    apiServer.sendResponse(req, res, req.session.user, 'User successfully logged out');
};

exports.getUser = function(req, res) {
    if (req.session.user) {
        apiServer.sendResponse(req, res, req.session.user, 'User Information in Session');
    } else {
        var e = "invalid user session";
        apiServer.sendError(e);
    }
};