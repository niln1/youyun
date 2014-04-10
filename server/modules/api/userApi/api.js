/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var users = require('./users');
var parameters = require('../utils/parameters');

// An array containing User API spec objects
module.exports = [{
    'url': '/api/v1/users',
    'GET': {
        'handler': users.readUsers,
        'required': [
            parameters.signature
        ],
        'optional': [],
        'description': 'List all reminder for that user',
        'response': {} // sample data
    }
}];