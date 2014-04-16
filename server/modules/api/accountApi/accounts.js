/*
 * file: accounts.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var nconf = require('nconf');
var fs = require('fs');
var auth = require('../../../middlewares/auth');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');

exports.login = function(req, res) {
    logger.info("AccountApi - Login");
    auth.doLogin(req, res);
};

exports.logout = function(req, res) {
    logger.info("AccountApi - Logout");
    req.session.user = null;
    apiServer.sendResponse(req, res, req.session.user, 'User successfully logged out');
};

exports.getUser = function(req, res) {
    logger.info("AccountApi - getUser");
    if (req.session.user) {
        var userImageUrl = "static/img/user_image/" + req.session.user._id + "_" + req.session.user.username + ".png";
        var defaultImageUrl = "static/img/default_image/default-user.png";
        fs.exists(userImageUrl, function(exists) {
            if (exists) {
                logger.debug("user-image exists");
                req.session.user.user_image = userImageUrl;
            } else {
                logger.debug("user-image don't exists, using the default-user-image");
                req.session.user.user_image = defaultImageUrl;
            }
            logger.debug("Successfully get User Information in Session");
            apiServer.sendResponse(req, res, req.session.user, 'User Information in Session');
        });
    } else {
        var e = "invalid user session";
        logger.warn("Error:" + e);
        apiServer.sendError(e);
    }
};