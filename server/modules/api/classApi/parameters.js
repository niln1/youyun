/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

exports.userId = {
    'type': 'string',
    'param': 'index',
    'description': 'userId',
    'default': 0
};

exports.count = {
    'type': 'integer',
    'param': 'count',
    'description': 'A limit on the number of objects to be returned.',
    'default': 100
};

exports.sortBy = {
    'type': 'string',
    'param': 'sort_by',
    'description': 'A comma separted list of fields. If unary minus(-) ' +
        'is specified before the field then the sort direction is descending.'
};

exports.filter = {
    'type': 'string',
    'param': 'filter',
    'description': 'A for performing a global case insensitive search.'
};

exports.startDate = {
    'type': 'string',
    'param': 'start_date',
    'description': 'The first date (UNIX Timestamp) of the requested date range'
};

exports.endDate = {
    'type': 'string',
    'param': 'end_date',
    'description': 'The last date (UNIX Timestamp) of the requested date range'
};

exports.scopeIds = {
    'type': 'list',
    'param': 'scope_ids',
    'description': 'A comma separated list containing the ems_node_ids'
};