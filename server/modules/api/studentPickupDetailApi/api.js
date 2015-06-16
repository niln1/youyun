/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */
'use strict';

var studentPickupDetails = require('./studentPickupDetails');
var parameters = require('../utils/parameters');

module.exports = [{
    'url': '/api/v1/studentpickupdetails',
    'GET': {
        'handler': studentPickupDetails.read,
        'required': [parameters.signature],
        'optional': [parameters.studentId],
        'description': 'read studentpickupdetails',
        'response': {} // sample data
    },
    'POST': {
        'handler': studentPickupDetails.create,
        'content-type': 'application/json',
        'required': [
        parameters.signature,
        ],
        'optional': [
        parameters.studentId,
        parameters.pickupGroup,
        parameters.pickedBy,
        parameters.mondayPickupTime,
        parameters.tuesdayPickupTime,
        parameters.wednesdayPickupTime,
        parameters.thursdayPickupTime,
        parameters.fridayPickupTime,
        parameters.saturdayPickupTime,
        parameters.sundayPickupTime
        ],
        'description': 'create studentpickupdetails',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/studentpickupdetails/{id}',
    'PATCH': {
        'handler': studentPickupDetails.updateWithId,
        'content-type': 'application/json',
        'required': [
            parameters.signature
        ],
        'optional': [
            parameters.pickedBy,
            parameters.mondayPickupTime,
            parameters.tuesdayPickupTime,
            parameters.wednesdayPickupTime,
            parameters.thursdayPickupTime,
            parameters.fridayPickupTime,
            parameters.saturdayPickupTime,
            parameters.sundayPickupTime
        ],
        'description': 'update the studentpickupdetails',
        'response': {} // sample data
    },
    'DELETE': {
        'handler': studentPickupDetails.deleteWithId,
        'required': [
            parameters.signature
        ],
        'optional': [],
        'description': 'delete the studentpickupdetails',
        'response': {} // sample data
    }
}];