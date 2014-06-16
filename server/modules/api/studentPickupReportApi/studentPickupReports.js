/*
* Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
*/
'use strict';

var User = require('../../../models/User');
var StudentPickupReport = require('../../../models/StudentPickupReport');
var mongoose = require('mongoose');

var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');
var __ = require('underscore');
var Q = require('q');

exports.init = function (req, res) {
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
        ])
    .spread(function (user, signatureIsValid) {
        if (user.userType < 3) {
            return true;
        } else {
            throw new Error("You don't have permission");
        }
    })
    .then(function (hasPermissionToRead) {
        var defer = Q.defer();
        StudentPickupReport.find()
        .exec(function (err, reports){
            if (err) defer.reject(err);
            else if (reports.length === 0) {
                User.findByOptions({ userType: 3, isPickUp: true},
                    function (err, students) {
                        if (err) defer.reject(err);
                        else if (students.length === 0) defer.reject(new Error("No Student Needs pickUp"));
                        else {
                            var needToPickupList = __.pluck(students, "_id");
                            var newStudentPickupReport = new StudentPickupReport({
                                needToPickupList: needToPickupList
                            });
                            newStudentPickupReport.save(function(err, data){   
                                if (err) defer.reject(err);
                                defer.resolve(data);
                            });
                        }
                    });
            } else defer.reject(new Error("Report Already initialized"));
        });
        return defer.promise;
    })
    .then(function (report) {
        apiServer.sendResponse(req, res, report, 'StudentPickupReport successfully inited')
    })
    .fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}

exports.readLocked = function (req, res) {
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
        ])
    .spread(function (user, signatureIsValid) {
        if (user.userType < 3) {
            return true;
        } else {
            throw new Error("You don't have permission");
        }
    })
    .then(function (hasPermissionToRead) {
        var defer = Q.defer();
        StudentPickupReport.findByLock(true,
            function (err, reports) {
                if (err) defer.reject(err);
                else
                    defer.resolve(reports);
            });
        return defer.promise;
    })
    .then(function (reports) {
        apiServer.sendResponse(req, res, reports, 'StudentPickupReport past Reports')
    })
    .fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}

exports.readCurrent = function (req, res) {
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
        ])
    .spread(function (user, signatureIsValid) {
        if (user.userType < 3) {
            return true;
        } else {
            throw new Error("You don't have permission");
        }
    })
    .then(function (hasPermissionToRead) {
        var defer = Q.defer();
        StudentPickupReport.findByLock(false,
            function (err, reports) {
                if (err) defer.reject(err);
                else if (reports.length === 0) 
                    defer.reject(new Error("report havned been initialized"));
                else if (reports.length > 1) 
                    defer.reject(new Error("Internal Error - current pk report"));
                else
                    defer.resolve(reports[0]);
            });
        return defer.promise;
    })
    .then(function (report) {
        apiServer.sendResponse(req, res, report, 'StudentPickupReport Current Report')
    })
    .fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}

exports.addAbsence = function (req, res) {}
