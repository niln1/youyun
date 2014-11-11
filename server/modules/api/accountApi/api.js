/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var accounts = require('./accounts');
var parameters = require('../utils/parameters');

// An array containing Alarm API spec objects
module.exports = [{
    'url': '/api/v1/account/login',
    'POST': {
        'content-type': 'application/x-www-form-urlencoded',
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
}, {
    'url': '/api/v1/account',
    'GET': {
        'handler': accounts.getUser,
        'required': [parameters.signature],
        'optional': [],
        'description': 'Get the user using session',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/account/device',
    'POST': {
        'content-type': 'application/json',
        'handler': accounts.addUserDevice,
        'required': [
            parameters.signature, 
            parameters.deviceType, 
            parameters.pushToken
        ],
        'optional': [],
        'description': 'Get the user using session',
        'response': {} // sample data
    }
}];
