/*
 * file: accounts.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var Q = require('q');
var nconf = require('nconf');
var auth = require('../../../middlewares/auth');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');

exports.login = function (req, res) {
    logger.info("AccountApi - Login");
    auth.doLogin(req, res);
};

exports.logout = function (req, res) {
    logger.info("AccountApi - Logout");
    req.session.user = null;
    apiServer.sendResponse(req, res, req.session.user, 'User successfully logged out');
};

exports.getUser = function (req, res) {
    logger.info("AccountApi - getUser");
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
    ]).then(function(result) {
        apiServer.sendResponse(req, res, result[0], 'User Information in Session');
    }).fail(function(err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}
