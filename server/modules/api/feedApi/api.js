/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */
'use strict';

var feeds = require('./feeds');
var parameters = require('../utils/parameters');

// An array containing Feeds API spec objects
module.exports = [{
    'url': '/api/v1/feeds',
    'GET': {
        'handler': feeds.read,
        'required': [
            parameters.signature,
            parameters.userId,
        ],
        'optional': [
            parameters.pageNumber,
        ],
        'description': 'Get all the feeds for user',
        'response': {} // sample data
    }
}];