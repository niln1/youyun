/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

"use strict";

var User = require('../../models/User');
var StudentPickupReport = require('../../models/StudentPickupReport');
var StudentParent = require('../../models/StudentParent');
var mongoose = require('mongoose');

var logger = require('../../utils/logger');
var __ = require('underscore');
var Q = require('q');

exports.route = function (socket) {
	socket.on('pickup::parents::add-absence', function (data) {
		var childId = mongoose.Types.ObjectId(data);

		Q.fcall(function () {
			if (socket.session.user.userType === 4) {
				return true;
			} else {
				throw new Error("You don't have permission");
			}
		})
		.then(function (isParent) {
			var defer = Q.defer();
			var parent = new User(socket.session.user);
			parent.hasChild(childId, defer);
			return defer.promise;
		})
		.then(function (report) {
			var defer = Q.defer();
			StudentPickupReport.findByLock(false,
				function (err, reports) {
					if (err) defer.reject(err);
					else if (reports.length === 0) 
						defer.reject(new Error("report havned been initialized"));
					else if (reports.length > 1) 
						defer.reject(new Error("Internal Error - current pk report"));
					else
						reports[0].addAbsence(childId, defer);
				});
			return defer.promise;
		})
		.then(function (report) {
			logger.info("done");
		})
		.fail(function (err) {
			logger.warn(err);
		});
	});
}