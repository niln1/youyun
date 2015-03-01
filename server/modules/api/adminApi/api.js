/*
 * Copyright (c) 2014, Tracy H. All rights reserved.
 */
'use strict';

var adminModule = require('./admin');
var parameters = require('../utils/parameters');

module.exports = [{
    'url': '/api/v1/admin/useradd',
    'POST': {
        'handler': adminModule.createUser,
        'content-type': 'application/json',
        'required': [
            parameters.signature,
            parameters.firstname,
            parameters.lastname,
            parameters.userType
        ],
        'optional': [],
        'description': 'create new user',
        'response': {} // sample data
    }
}];