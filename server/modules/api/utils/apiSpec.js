/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var __ = require('underscore');
var logger = require('../../../utils/logger');

var apiModules = [
    require('../accountApi/api'),
    require('../classApi/api'),
    require('../reminderApi/api'),
    require('../userApi/api'),
    require('../feedApi/api'),
    require('../studentPickupReportApi/api'),
    require('../studentPickupDetailApi/api'),
    require('../adminApi/api')

];

// creating the global apiSpec object
var apiSpec = {};

__.each(apiModules, function(module) {
    __.each(module, function(api) {
        apiSpec[api.url] = api;
    });
});

module.exports = apiSpec;