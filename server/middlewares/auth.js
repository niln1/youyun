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

function userAuthenticationFailed(req, res, message) {
    req.session.user = null;
    if (req.url.search(/^\/api\/v\d*\/[a-zA-Z0-9\/\-%]*/) !== -1) {
        res.json(401, {
            'result': 'false',
            'message': !e ? 'User not authenticated' : e,
            'description': message + '. Please login',
            'source': nconf.get('SERVER_NAME')
        });
    } else {
        req.flash('error', message); // TODO
        res.redirect('/login');
    }
}

function userNotAuthenticated(req, res, e) {
    req.session.user = null;
    if (req.url.search(/^\/api\/v\d*\/[a-zA-Z0-9\/\-%]*/) !== -1) {
        res.json(401, {
            'result': 'false',
            'message': !e ? 'User not authenticated' : e,
            'description': 'Invalid Cookie. Please login',
            'source': nconf.get('SERVER_NAME')
        });
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
    if (!req.body.username || !req.body.password) {
        return userAuthenticationFailed(req, res, '用户名或者密码不能为空');
    }

    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err || !user) return userAuthenticationFailed(req, res, '用户名或者密码错误');

        user.comparePassword(req.body.password, function(err, match) {
            if (err || !match) return userAuthenticationFailed(req, res, '用户名或者密码错误');

            req.session.user = user;
            res.redirect('/');
        });
    });
}

exports.checkUserSession = function(req, res, next) {
    var path = req.url;
    var isInWhitelist = false;
    var whitelistPatterns = [
        /^\/(login|logout)/,
        /^\/api\/v\d\/accounts\/(login|logout|getuser)/,
        /^\/static\//
    ];

    __.each(whitelistPatterns, function(pattern) {
        isInWhitelist = isInWhitelist || (path.search(pattern) !== -1);
    });

    if (isInWhitelist) {
        next();
    } else {
        isUserAuthenticated(req, res, next);
    }
};