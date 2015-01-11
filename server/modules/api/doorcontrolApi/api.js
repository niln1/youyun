/* 
* @Author: Nil
* @Date:   2015-01-11 16:13:11
* @Last Modified by:   Nil
* @Last Modified time: 2015-01-11 16:16:00
* Copyright (c) 2014, Zhihao Ni. All rights reserved.
*/

'use strict';

var controller = require('./controller');
var parameters = require('../utils/parameters');

// An array containing Feeds API spec objects
module.exports = [{
    'url': '/api/v1/doorcontrol/validate',
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