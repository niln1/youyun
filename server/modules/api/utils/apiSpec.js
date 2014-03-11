/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var __ = require('underscore');

var apiModules = [
    require('../accountApi/api'),
    require('../classApi/api'),
    require('../reminderApi/api')
];

// creating the global apiSpec object
var apiSpec = {};

__.each(apiModules, function(module) {
    __.each(module, function(api) {
        apiSpec[api.url] = api;
    });
});

module.exports = apiSpec;