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
 var socketServer = require('../../utils/socketServer');

 exports.route = function (socket) {
 	socket.on('pickup::teacher::get-reports', function (data) {
 		socketServer.validateUserSession(socket)
		.then(function (user) {
			if (user.isTeacher() || user.isAdmin() || user.isSchool()) {
				return StudentPickupReport.findAllReports();
			} else {
				throw new Error("You don't have permission");;
			}
		})
 		.then(function (reports) {
			logger.info("Found", reports);
			socket.emit('pickup::teacher:update-reports', reports);
		})
		.fail(function (err) {
			logger.warn(err);
			socket.emit('pickup::all:error', err);
		});
 	});

	socket.on('pickup::parent::get-child-report', function (data) {

		socketServer.validateUserSession(socket)
		.then(function (user) {
			if (user.isParent()) {
				return [user, StudentParent.findChildrenByParent(user)];
			} else {
				throw new Error('You do not have access to this socket route');
			}
		})
		.spread(function (parent, children) {
			return [parent, children, StudentPickupReport.findReportsByUsers(children)]
		})
		.spread(function (parent, children, reports) {
			socket.emit('pickup::parent::get-child-report::success', reports);
		})
		.fail(function (err) {
			socket.emit('pickup::parent::get-child-report::failure', err.toString());
		});
	});

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
	socket.on('pickup::create-report', function (data) {
		Q.fcall(function () {
			if (socket.session.user.userType <= 3) {
				return true;
			} else {
				throw new Error("You don't have permission to create pickup report");
			}
		}).then(function (hasPermission) {
			if (data && data.date && data.userIds) {
				var dateToValidate = moment(data.date).tz('UTC').startOf('day');
				var startingAvailableDate = moment(new Date()).tz('UTC').startOf('day').add('days', 1);
				if (dateToValidate.isSame(startingAvailableDate) || dateToValidate.isAfter(startingAvailableDate)) {
					if (data.userIds.length <= 0) {
						throw new Error("No student needs pickup");
					}
					return true;
				} else {
					throw new Error("Cannot create a pickup report for the past.");
				}
			} else {
				throw new Error("Please specify date and users to pickup.");
			}
		}).then(function () {
			// check if there is one report with same date.
			var defer = Q.defer();
			StudentPickupReport.find({date: data.date}).exec(function(err, reports){
				if (err) defer.reject(err);
				else if (reports.length === 0) defer.resolve();
				else defer.reject(new Error("Report Already Exists"));
			});
			return defer.promise;
		}).then(function () {
			var defer = Q.defer();

			var newReport = new StudentPickupReport({
				needToPickupList: data.userIds,
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
			logger.info("report Created");
			socket.emit('pickup::create::success', report);
			// TODO broadcast this message;
		}).fail(function (err) {
			logger.warn(err);
			socket.emit('pickup::create::error', err.toString());
		});
	});

	socket.on('pickup::parent::add-absence', function (data) {
		socketServer.validateUserSession(socket)
		.then(function (user) {
			var defer = Q.defer();

			if (user.isParent()) {
				if (data.reportID && data.childID && data.needToPickup) {
					var needToPickup = JSON.parse(data.needToPickup)
					defer.resolve([user, StudentPickupReport.findByID(data.reportID), data.childID, needToPickup]);
				} else {
					defer.reject(new Error('Required fields missing'));
				}
			} else {
				defer.reject(new Error('401 Unauthorized'));
			}

			return defer.promise;
		})
		.spread(function (user, report, childID, needToPickup) {
			var dateToValidate = moment(report.date).tz('UTC').startOf('day');
			var startingAvailableDate = moment(new Date()).tz('UTC').startOf('day').add('days', 1);
			if (dateToValidate.isSame(startingAvailableDate) || dateToValidate.isAfter(startingAvailableDate)) {
				return [user, report, childID, needToPickup];
			} else {
				throw new Error('Cannot modify pickup report from the past');
			}
		})
		.spread(function (user, report, childID, needToPickup) {
			var defer = Q.defer();

			var childObjectID = mongoose.Types.ObjectId(childID.toString());

			if (needToPickup) {
				var index = report.absenceList.indexOf(childObjectID);
				if (index !== -1) {
					report.absenceList.splice(index, 1);
					report.needToPickupList.push(childObjectID);
					report.save(function (err, report) {
						if (err) defer.reject(err);
						else defer.resolve(report);
					});
				} else {
					defer.reject(new Error('ChildID not in absence list.'));
				}
			} else {
				var index = report.needToPickupList.indexOf(childObjectID)
				if (index !== -1) {
					report.needToPickupList.splice(index, 1);
					report.absenceList.push(childObjectID);
					report.save(function (err, report) {
						if (err) defer.reject(err);
						else defer.resolve(report);
					});
				} else {
					defer.reject(new Error('ChildID not in need to pickup list.'));
				}
			}

			return defer.promise;
		})
		.then(function (report) {
			socket.emit('pickup::parent::add-absence::success', report);
			// TODO broadcast this event
		})
		.fail(function (err) {
			logger.warn(err.toString());
			socket.emit('pickup::parent::add-absence::failure', err.toString());
		})
	});
}