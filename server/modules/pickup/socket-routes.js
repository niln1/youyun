/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 * TODO: need to make things more clean before every emit...
 */

"use strict";

var User = require('../../models/User');
var StudentPickupReport = require('../../models/StudentPickupReport');
var StudentParent = require('../../models/StudentParent');
var StudentPickupDetail = require('../../models/StudentPickupDetail');
var mongoose = require('mongoose');

var moment = require('moment-timezone');
var timezone = 'America/Los_Angeles';
var storedFormat = 'YYYY-MM-DD HH:mm';
moment.tz.setDefault(timezone);

var __ = require('underscore');
var Q = require('q');
var socketServer = require('../../utils/socketServer');
var PNServer = require('../../utils/pushNotificationServer');

exports.route = function (socket) {
    // for web
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
            if (reports) reports = castPassword(reports);
            logger.info('Sent ' + reports.length + ' reports for get-reports');
            socket.emit('pickup::teacher:update-reports', reports);
        })
        .fail(function (err) {
            logger.warn(err);
            socket.emit('all::failure', err);
        });
    });

    // for app
    socket.on('pickup::teacher::get-report-for-today', function (data) {
        socketServer.validateUserSession(socket)
        .then(function (user) {
            if (user.isTeacher() || user.isAdmin() || user.isSchool()) {
                return StudentPickupReport.findReportForToday();
            } else {
                throw new Error("You don't have permission");;
            }
        })
        .then(function (report) {
            if (report) {
                //TODO: this is bad need rework casting password
                report = castPassword(report);
                logger.info("found report for 'get report for today'");
                report.needToPickupList = __.filter(report.needToPickupList,
                    function(student) {
                        // only check value
                        return socket.session.user._id == student.studentPickupDetail.pickedBy;
                    });
                report.pickedUpList = __.filter(report.pickedUpList,
                    function(data) {
                        // only check value
                        return socket.session.user._id == data.pickedBy._id;
                    });
                logger.info("filtered report for the current user");
                socket.emit('pickup::teacher::get-report-for-today::success', report);
            } else {
                throw new Error("No report for today");;
            }
        })
        .fail(function (err) {
            logger.warn("Error: pickup::teacher::get-report-for-today::fail");
            logger.warn(err);
            socket.emit('all::failure', err);
            socket.emit('pickup::teacher::get-report-for-today::fail', err);
        });
    });

    // Not used?
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
            if (reports) reports = castPassword(reports);
            if (children) children = castPassword(children);

            socket.emit('pickup::parent::get-child-report::success', { 
                    reports: reports,
                    children: children
                });
        })
        .fail(function (err) {
            socket.emit('all::failure', err.toString());
        });
    });

    socket.on('pickup::parent::get-future-child-report', function (data) {

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
            logger.info("starting get-future-child-report");
            var dateToValidate = moment(new Date()).startOf('day');
            var futureReports = __.filter(reports, function(report) { 
                var today = dateToValidate.format(storedFormat);
                var reportDate = moment(report.date).utc().startOf('day').format(storedFormat);
                return moment(today).unix() <= moment(reportDate).unix();
            });
            if (futureReports) futureReports = castPassword(futureReports);
            if (children) children = castPassword(children);
            logger.info("getting future reports");
            socket.emit('pickup::parent::get-future-child-report::success', { 
                    reports: futureReports,
                    children: children
                });
        })
        .fail(function (err) {
            socket.emit('all::failure', err.toString());
        });
    });

    socket.on('pickup::delete-report', function (data) {
        Q.fcall(function () {
            if (socket.session.user.userType <= 3) {
                return true;
            } else {
                throw new Error("You don't have permission to delete pickup report");
            }
        }).then(function (hasPermission) {
            return StudentPickupReport.findByID(data.reportID);
        }).then(function (report) {
            // get user list
            var defer = Q.defer();
            report.remove(function(err, report) {
                if (err) defer.reject(err);
                else {
                    defer.resolve();
                }
            });
            return defer.promise;
        }).then(function () {
            logger.info("report deleted " + data.reportID);
            socket.emit('pickup::delete::success', {});
            // TODO broadcast this message;
        }).fail(function (err) {
            logger.warn(err);
            socket.emit('pickup::delete::error', err.toString());
        });
    });

    socket.on('pickup::create-report', function (data) {
        var dateToValidate;

        Q.fcall(function () {
            if (socket.session.user.userType <= 3) {
                return true;
            } else {
                throw new Error("You don't have permission to create pickup report");
            }
        }).then(function (hasPermission) {
            if (data && data.date) {
                dateToValidate = moment(data.date).startOf('day');

                var startingAvailableDate = moment(new Date()).startOf('day');
                if (dateToValidate.isSame(startingAvailableDate) || dateToValidate.isAfter(startingAvailableDate)) {
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
            StudentPickupReport.find({
                date: dateToValidate.format(storedFormat)
            }).exec(function(err, reports){
                if (err) defer.reject(err);
                else if (reports.length === 0) defer.resolve();
                else defer.reject(new Error("Report Already Exists"));
            });
            return defer.promise;
        }).then(function () {
            // get user list
            var defer = Q.defer();
            var dayOfTheWeek = moment(dateToValidate).format('d'); 
            var existAndNotEmpty = { $exists:true, $ne: "" };
            var dayString;

            switch(dayOfTheWeek) {
                case "0":
                    dayString = "sundayPickupTime";
                    break;
                case "1":
                    dayString = "mondayPickupTime";
                    break;
                case "2":
                    dayString = "tuesdayPickupTime";
                    break;
                case "3":
                    dayString = "wednesdayPickupTime";
                    break;
                case "4":
                    dayString = "thursdayPickupTime";
                    break;
                case "5":
                    dayString = "fridayPickupTime";
                    break;
                case "6":
                    dayString = "saturdayPickupTime";
                    break;
                default:
                    throw new Error("Fail to get the day string");
            }

            StudentPickupDetail.find()
            .where("pickedBy").exists(true)
            .where(dayString).exists(true).ne("")
            .populate('student')
            .exec(function(err, details) {
                if (err) defer.reject(err);
                else {
                    var filteredDetails = __.filter(details, 
                        function(detail){ 
                            // filter all the ones without pickup location
                            return detail.student.pickupLocation != null 
                            && detail.student.pickupLocation !== "";
                        });

                    defer.resolve(filteredDetails);
                }
            });

            return defer.promise;
        }).then(function (details) {
            var defer = Q.defer();

            var needToPickupList = __.pluck(__.pluck(details, 'student'), '_id');
            if (needToPickupList.length === 0) throw new Error("No student need to pickup");
            
            var newReport = new StudentPickupReport({
                needToPickupList: needToPickupList,
                absenceList: [],
                pickedUpList: [],
                date: dateToValidate.format(storedFormat)
            });

            newReport.save(function (err) {
                if (err) defer.reject(err);
                else defer.resolve(newReport);
            });

            return defer.promise;
        }).then(function (report) {
            if (report) report = castPassword(report);
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
            // only allow add absence for today or after
            // TODO: need cleanup
            var dateToValidate = moment(report.date).utc();
            var startingAvailableDate = moment(new Date()).startOf('day');
            if (dateToValidate.utc().format('L') === startingAvailableDate.format('L')
                || dateToValidate.isAfter(startingAvailableDate)) {
                return [user, report, childID, needToPickup];
            } else {
                throw new Error('Cannot modify pickup report from the past');
            }
        })
        .spread(function (user, report, childID, needToPickup) {
            var defer = Q.defer();
            // TODO: need refactor
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
            if (report) report = castPassword(report);
            socket.emit('pickup::parent::add-absence::success', report);
            // broadcast this event
            socket.broadcast.emit('pickup::all::add-absence::success', report);
        })
        .fail(function (err) {
            logger.warn(err.toString());
            socket.emit('all::failure', err.toString());
        })
    });

    /**
     * This event handles pickup and unpick
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    socket.on('pickup::teacher::pickup-student', function (data) {
        socketServer.validateUserSession(socket)
        .then(function (user) {
            var defer = Q.defer();

            if (user.isTeacher()) {
                if (data.reportID && data.studentID && data.pickedUp) {
                    var pickedUp = JSON.parse(data.pickedUp)
                    defer.resolve([user, StudentPickupReport.findByID(data.reportID), data.studentID, pickedUp]);
                } else {
                    defer.reject(new Error('Required fields missing'));
                }
            } else {
                defer.reject(new Error('401 Unauthorized'));
            }

            return defer.promise;
        })
        .spread(function (user, report, studentID, pickedUp) {
            var dateToValidate = moment(report.date).utc();
            var startingAvailableDate = moment(new Date()).startOf('day');
            if (dateToValidate.format('L') === startingAvailableDate.format('L')
             || dateToValidate.isAfter(startingAvailableDate)) {
                return [user, report, studentID, pickedUp];
            } else {
                throw new Error('Cannot modify pickup report from the past');
            }
        })
        .spread(function (user, report, studentID, pickedUp) {
            if (pickedUp) {
                return report.pickUpStudent(studentID, user._id);
            } else {
                return report.unpickPickedUp(studentID, user._id);
            }
        })
        .then(function (data) {
            if (data) data = castPassword(data);
            socket.emit('pickup::teacher::pickup-student::success', data);
            // broadcast this event
            socket.broadcast.emit('pickup::all::picked-up::success', data);

            var message, infoType;
            var type = 'pickup';
            var studentName = data.student.firstname + ' ' + data.student.lastname;
            var teacherName = socket.session.user.firstname + ' ' + socket.session.user.lastname;
            if (data.picked) {
                var time = moment(data.record.pickedUpTime).format('LT');
                message = 'Your child ' + studentName +
                    ' is picked by ' + teacherName + ' at ' + time + '.';
                infoType = 'success';
            } else {
                // unPickedTime
                message = 'Your child ' + studentName +
                    ' is not picked by ' + teacherName +
                    ' yet, the info before is clicked by mistake, Sorry for that ;)' + '';
                infoType = 'info';
            }   
            return PNServer.notifyParent(data.student, message, type, infoType);
        })
        .fail(function (err) {
            logger.warn(err.toString());
            socket.emit('all::failure', err.toString());
        })
    });
}

function castPassword(object) {
    // lean the mongoose document
    var newObject = object;
    if (object == null) return;
    if (object.toObject) newObject = object.toObject({ getters: true, virtuals: true }); 
    if (__.isObject(newObject)) {
        if (newObject.password) {
            newObject.password = "Black Sheep Wall";
        };
        __.each(newObject, function(element, key, list){
            list[key] = castPassword(element);
        });
    }
    return newObject;
}