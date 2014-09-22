/*
 * file: auth.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 *
 * Checks if the user is authenticated to view pages based
 * on the current enviroment.
 * Nginx environment must not allow static files access.
 *
 * All other enviroments like production, development, test and coverage
 * must allow viewing of static files without authentication.
 *
 * In addition all the environments must allow access to the base path(/)
 * and the path /api/v1/accounts/(login|logout|getuser)
 */


'use strict';

var __ = require('underscore');
var nconf = require('nconf');
var User = require('../models/User');
var apiServer = require('../modules/api/utils/apiServer');
var logger = require('../utils/logger');

function apiLoginSuccess(req, res, user) {
    req.session.user = user;
    apiServer.sendResponse(req, res, user, 'User authenticated successfully');
}

function userAuthenticationFailed(req, res, e) {
    req.session.user = null;
    if (req.url.search(/^\/api\/v\d*\/[a-zA-Z0-9\/\-%]*/) !== -1) {
        apiServer.userNotAuthenticated(req, res, e);
    } else {
        req.flash('error', e); // TODO
        res.redirect('/login');
    }
}

function userNotAuthenticated(req, res, e) {
    req.session.user = null;
    if (req.url.search(/^\/api\/v\d*\/[a-zA-Z0-9\/\-%]*/) !== -1) {
        apiServer.userNotAuthenticated(req, res, e);
    } else {
        // redirect to login page
        res.redirect('/login');
    }
}

function isUserAuthenticated(req, res, next) {
    if (!req.session.user) {
        userNotAuthenticated(req, res);
    } else {
        next();
    }
}

exports.doLogin = function(req, res) {
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        logger.warn("Login Error: '用户名或者密码不能为空'");
        return userAuthenticationFailed(req, res, '用户名或者密码不能为空');
    }

    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err || !user) {
            logger.warn("Login Error: '用户名或者密码错误'");
            return userAuthenticationFailed(req, res, '用户名或者密码错误');
        };
        user.comparePassword(req.body.password, function(err, match) {
            logger.warn(err);
            logger.warn(match);
            if (err || !match) {
                logger.warn("Login Error: '用户名或者密码错误'");
                return userAuthenticationFailed(req, res, '用户名或者密码错误');
            };
            // casting out password
            user.password = "This is a Joke, My friend";

            logger.info("Login Success - " + user.username + "-" + user._id);
            logger.debug("User Data:" + JSON.stringify(user));

            if (req.url.search(/^\/api\/v\d*\/[a-zA-Z0-9\/\-%]*/) !== -1) {
                apiLoginSuccess(req, res, user);
            } else {
                req.session.user = user;
                res.redirect('/login');
            }
        });
    });
}

exports.checkUserSession = function(req, res, next) {
    var path = req.url;
    var isInWhitelist = false;
    var whitelistPatterns = [
        /^\/(login|logout)/,
        /^\/api\/v\d\/account\/(login|logout|getuser)/
    ];

    if (process.env.NODE_ENV !== 'nginx') {
        whitelistPatterns.push(/^\/static\/.*/);
        whitelistPatterns.push(/^.*\.map$/);
        whitelistPatterns.push(/^.*\.js$/);
        whitelistPatterns.push(/^.*\.ts$/);
        whitelistPatterns.push(/^.*\.css$/);
        whitelistPatterns.push(/^.*\.scss$/);
        whitelistPatterns.push(/^.*\.sass$/);
        whitelistPatterns.push(/^.*\.less$/);
        whitelistPatterns.push(/^.*\/img\/.*$/);
        whitelistPatterns.push(/^.*\.json$/);
        whitelistPatterns.push(/^.*\.tmpl$/);
        whitelistPatterns.push(/^.*\.html$/);
        whitelistPatterns.push(/^.*\.woff$/);
    }
    __.each(whitelistPatterns, function(pattern) {
        isInWhitelist = isInWhitelist || (path.search(pattern) !== -1);
    });

    if (isInWhitelist) {
        next();
    } else {
        isUserAuthenticated(req, res, next);
    }
};