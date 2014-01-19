/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var apiServer = require('../utils/apiServer');

exports.readClasses = function(req, res) {
    console.log(JSON.stringify(req.path));
    console.log(JSON.stringify(req.url));

    var tempNext = function(req, res) {
        res.send('success');
    };

    apiServer.verifySignature(req, res, tempNext);
    // apiServer.get(req, res, '/api/object/classes', 'get', 1);
};