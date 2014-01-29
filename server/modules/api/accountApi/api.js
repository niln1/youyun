/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var accounts = require('./accounts');
var parameters = require('./parameters');

// An array containing Alarm API spec objects
module.exports = [{
    'url': '/api/v1/account/login',
    'GET': {
        'handler': accounts.login,
        'required': [parameters.username, parameters.password],
        'optional': [],
        'format': {
            'username': 'admin',
            'password': 'adminpw'
        },
        'response': {}
    }
}, {
    'url': '/api/v1/account/logout',
    'GET': {
        'handler': accounts.logout,
        'required': [],
        'optional': [],
        'description': 'List the students in a class managed by the User',
        'response': {} // sample data
    }
}];