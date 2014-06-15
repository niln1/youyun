/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var User = require('../../../models/User');
var StudentPickupReport = require('../../../models/StudentPickupReport');
var mongoose = require('mongoose');

var logger = require('../../../utils/logger');
var __ = require('underscore');
var Q = require('q');

exports.initStudentPickupReport = function (hasPermissionToRead) {
	var defer = Q.defer();
	defer.reject(new Error("hel"));
	console.log(hasPermissionToRead);
}
