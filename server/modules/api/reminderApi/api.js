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
            parameters.message,
            parameters.dueDate
        ],
        'optional': [
            parameters.isDone
        ],
        'description': 'Create the reminder',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/reminders/{id}',
    'PATCH': {
        'handler': reminders.updateReminderWithId,
        'content-type': 'application/json',
        'required': [
            parameters.signature
        ],
        'optional': [
            parameters.message,
            parameters.dueDate,
            parameters.isDone
        ],
        'description': 'update the reminder',
        'response': {} // sample data
    },
    'DELETE': {
        'handler': reminders.deleteReminderWithId,
        'content-type': 'application/json',
        'required': [
            parameters.signature
        ],
        'optional': [],
        'description': 'delete the reminder',
        'response': {} // sample data
    }
}];