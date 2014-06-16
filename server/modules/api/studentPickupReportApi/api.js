/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var studentPickupReports = require('./studentPickupReports');
var parameters = require('../utils/parameters');

module.exports = [{
    'url': '/api/v1/studentpickupreports',
    'GET': {
        'handler': studentPickupReports.readLocked,
        'required': [parameters.signature],
        'optional': [],
        'description': 'List all old reports',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/studentpickupreports/addabsence',
    'POST': {
        'handler': studentPickupReports.addAbsence,
        'required': [parameters.signature, parameters.userId],
        'optional': [],
        'description': 'addAbsence student to current report',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/studentpickupreports/current',
    'GET': {
        'handler': studentPickupReports.readCurrent,
        'required': [parameters.signature],
        'optional': [],
        'description': 'show current report',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/studentpickupreports/init',
    'GET': {
        'handler': studentPickupReports.init,
        'required': [parameters.signature],
        'optional': [],
        'description': 'init pickup report',
        'response': {} // sample data
    }
}];