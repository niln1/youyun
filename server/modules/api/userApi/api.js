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
        'description': 'List all users that user is able to view',
        'response': {} // sample data
    },
    'POST': {
        'handler': users.createUser,
        'content-type': 'application/json',
        'required': [
            parameters.signature,
            parameters.username,
            parameters.password,
            parameters.userType
        ],
        'optional': [parameters.classList],
        'description': 'create user',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/users/image',
    'POST': {
        'handler': users.updateUserImage,
        'content-type': 'multipart/form-data',
        'required': [
            parameters.signature,
        ],
        'optional': [],
        'description': 'create user image',
        'response': {} // sample data
    },
    'PUT': {
        'handler': users.updateUserImage,
        'content-type': 'multipart/form-data',
        'required': [
            parameters.signature,
        ],
        'optional': [],
        'description': 'create user image',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/users/child',
    'GET': {
        'handler': users.getChild,
        'required': [
            parameters.signature,
            parameters.userId
        ],
        'optional': [],
        'description': 'return child user of user with userId',
        'response': {} // sample data
    }
}];