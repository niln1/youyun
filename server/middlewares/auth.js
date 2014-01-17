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

function userNotAuthenticated(req, res, e) {
    req.session.user = null;
    if (req.url.search(/^\/api\/v\d*\/[a-zA-Z0-9\/\-%]*/) !== -1) {
        res.json(401, {
            'result': 'false',
            'message': !e ? 'User not authenticated' : e,
            'description': 'Invalid Cookie. Please login',
            'source': 'youyun server'
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

module.exports.checkUserSession = function(req, res, next) {
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