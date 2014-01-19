/*
 * file: alarmsApi.js
 * Copyright (c) 2013, Cyan, Inc. All rights reserved.
 */
'use strict';

var classes = require('./classes');
var parameters = require('./parameters');

// An array containing Alarm API spec objects
module.exports = [{
    'url': '/api/v1/read_class',
    'GET': {
        'handler': classes.readClasses,
        'required': [],
        'optional': [],
        'description': 'List all class managed by the User',
        'response': {} // sample data
    }
}];