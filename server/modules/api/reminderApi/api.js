/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var reminders = require('./reminders');
var parameters = require('./parameters');

// An array containing Reminder API spec objects
module.exports = [{
    'url': '/api/v1/reminders',
    'GET': {
        'handler': reminders.readReminders,
        'required': [
        	parameters.signature 
        ],
        'optional': [],
        'description': 'List all reminder for that user',
        'response': {} // sample data
    },
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
		'description': 'Create the reminder',
		'response': {} // sample data
	}
}];