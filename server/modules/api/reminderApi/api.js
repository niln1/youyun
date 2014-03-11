/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var reminders = require('./reminders');
var parameters = require('./parameters');

// An array containing Alarm API spec objects
module.exports = [{
    'url': '/api/v1/reminders/read',
    'GET': {
        'handler': reminders.readReminders,
        'required': [
        	parameters.signature 
        ],
        'optional': [],
        'description': 'List all class managed by the User',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/reminders/create',
    'POST': {
        'handler': reminders.createReminder,
        'content-type': 'application/json',
        'required': [
        	parameters.signature, 
        	parameters.message
        ],
        'optional': [
        	parameters.dueDate
        ],
        'description': 'List the students in a class managed by the User',
        'response': {} // sample data
    }
}];