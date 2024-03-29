/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var classes = require('./classes');
var parameters = require('../utils/parameters');

// An array containing Alarm API spec objects
module.exports = [{
    'url': '/api/v1/classes',
    'GET': {
        'handler': classes.readClasses,
        'required': [parameters.signature],
        'optional': [],
        'description': 'List all class managed by the User',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/classes/students',
    'GET': {
        'handler': classes.readStudentsByClasses,
        'required': [parameters.signature, parameters.classId],
        'optional': [],
        'description': 'List the students in a class managed by the User',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/classes/instructors',
    'GET': {
        'handler': classes.readInstructorsByClasses,
        'required': [parameters.signature, parameters.classId],
        'optional': [],
        'description': 'List the instructors in a class managed by the User',
        'response': {} // sample data
    }
}];