/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

 "use strict";

 var User = require('../../models/User');
 var StudentPickupReport = require('../../models/StudentPickupReport');
 var StudentParent = require('../../models/StudentParent');
 var mongoose = require('mongoose');

 var moment = require('moment-timezone');

 var logger = require('../../utils/logger');
 var __ = require('underscore');
 var Q = require('q');

 exports.route = function (socket) {
	// need to change
	socket.on('pickup::all::get-current-report', function (data) {
		Q.fcall(function () {
			if (socket.session.user.userType < 3) {
				return true;
			} else {
				throw new Error("You don't have permission");
			}
		})
		.then(function (havePermission) {
			var defer = Q.defer();
			StudentPickupReport.findByLock(false,
				function (err, reports) {
					if (err) defer.reject(err);
					else if (reports.length === 0) 
						defer.reject(new Error("report havned been initialized"));
					else
						defer.resolve(reports[0]);
				});
			return defer.promise;
		})
		.then(function (report) {
			logger.info("done");
			socket.emit('pickup::all:update-current-report', report);
		})
		.fail(function (err) {
			logger.warn(err);
			socket.emit('pickup::all:error', err);
		});
	});
	socket.on('pickup::create', function (data) {
		Q.fcall(function () {
			if (socket.session.user.userType <= 3) {
				return true;
			} else {
				throw new Error("You don't have permission to create pickup report");
			}
		}).then(function (hasPermission) {
			if (data && data.date && data.users) {
				var dateToValidate = moment(data.date).tz('UTC').startOf('day');
				var startingAvailableDate = moment(new Date()).tz('UTC').startOf('day').add('days', 1);
				if (dateToValidate.isSame(startingAvailableDate) || dateToValidate.isAfter(startingAvailableDate)) {
					return true;
				} else {
					throw new Error("Cannot create a pickup report for the past.");
				}
			} else {
				throw new Error("Please specify date and users to pickup.");
			}
		}).then(function () {
			var defer = Q.defer();

			var newReport = new StudentPickupReport({
				needToPickupList: data.users,
				absenceList: [],
				pickedUpList: [],
				date: data.date
			});

			newReport.save(function (err) {
				if (err) defer.reject(err);
				else defer.resolve(newReport);
			});

			return defer.promise;
		}).then(function (report) {
			socket.emit('pickup::create::success', report);
			
			// TODO broadcast this message;
		}).fail(function (err) {
			socket.emit('pickup::create::error', err.toString());
		});
	});

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
			socket.broadcast.emit('pickup::all:update-current-report', report);
		})
		.fail(function (err) {
			logger.warn(err);
			socket.emit('pickup::all:error', err);
		});
	});
}