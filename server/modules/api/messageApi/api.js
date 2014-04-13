/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var messages = require('./messages');
var parameters = require('../utils/parameters');

// An array containing Alarm API spec objects
module.exports = [{
    'url': '/api/v1/messages',
    'GET': {
        'handler': messages.readClasses,
        'required': [parameters.signature, parameters.userId],
        'optional': [],
        'description': 'List all class managed by the User',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/messages/students',
    'GET': {
        'handler': messages.readStudentsByClasses,
        'required': [parameters.signature, parameters.classId],
        'optional': [],
        'description': 'List the students in a class managed by the User',
        'response': {} // sample data
    }
}];