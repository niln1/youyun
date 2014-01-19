/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var __ = require('underscore');

var apiModules = [
    require('../classApi/api'),
];

// creating the global apiSpec object
var apiSpec = {};

__.each(apiModules, function(module) {
    __.each(module, function(api) {
        console.log("APISPEC:" + JSON.stringify(api));
        apiSpec[api.url] = api;
    });
});

module.exports = apiSpec;