/*
 * file: accounts.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var auth = require('../../../middlewares/auth');
var nconf = require('nconf');

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