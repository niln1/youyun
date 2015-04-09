/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */
 'use strict';

 var StudentPickupDetail = require('../../../models/StudentPickupDetail');
 var User = require('../../../models/User');
 var apiServer = require('../utils/apiServer');
 var logger = require('../../../utils/logger');

 var __ = require('underscore');
 var Q = require('q');

exports.create = function (req, res) {
    return apiServer.apiCallHelper(req, res, {
        infoMessage: "StudentPickupDetail -- Create",
        userValidationHandler: function(user, signatureIsValid) {
            // find if student id exist
            if (user.isAdmin()) {
                return true;
            } else {
                throw new Error("U dont have Permission Dude");
            }
        },
        processHandler: function() {
            // do some thing
            if (req.body.studentId) {
                var defer = Q.defer();

                logger.debug("Param: studentId: " + req.body.studentId);
                var data = JSON.parse(JSON.stringify(req.body)); // create a simple clone just for the data
                data.student = data.studentId;
                delete data.signature;
                delete data.studentId;
                
                logger.debug("Param: " + JSON.stringify(data));

                var newStudentPickupDetail = new StudentPickupDetail(data);

                newStudentPickupDetail.save(function (err, detail) {
                    if (err) defer.reject(err);
                    defer.resolve(detail);
                });
            } else if (req.body.pickupGroup) {
                var defer = Q.defer();

                logger.debug("Param: group: " + req.body.pickupGroup);

                var data = JSON.parse(JSON.stringify(req.body)); // create a simple clone just for the data
                delete data.signature;
                delete data.pickupGroup;

                User.findStudentsByPickupLocation(req.body.pickupGroup)
                .then(function (users){  
                    var subDefer = Q.defer();
                    var calls = [];

                    var fn = function (id) {
                        var defer1 = Q.defer();
                        var pickupData = data;
                        pickupData.student = id;

                        var newStudentPickupDetail = new StudentPickupDetail(data);

                        newStudentPickupDetail.save(function (err, detail) {
                            if (err) defer1.reject(err);
                            defer1.resolve(detail);
                        });
                        return defer1.promise;
                    };


                    for (var i in users) {
                        calls.push(fn(user[i]._id));
                    }

                    Q.all(calls)
                    .done(function(data){
                        console.log(data);
                        subDefer.resolve();
                    }).fail(function(err){
                        console.log('ERROR', err);
                    });

                    return subDefer.promise;
                }).then(function(data){
                    defer.resolve(data);
                })

            } else {
                throw new Error("no id or group found");
            }
            return defer.promise;
        },
        successHandler: function(detail) {
            logger.info("StudentPickupDetail -- Create Success");
            apiServer.sendResponse(req, res, detail, 'StudentPickupDetail info successfully Created');
        }
    });
}

exports.read = function (req, res) {
    return apiServer.apiCallHelper(req, res, {
        infoMessage: "StudentPickupDetail -- Read",
        userValidationHandler: function(user, signatureIsValid) {
            if (user.isAdmin()) {
                return true;
            } else {
                throw new Error("U dont have Permission Dude");
            }
        },
        processHandler: function() {
            var defer = Q.defer();

            StudentPickupDetail.find({})
            .populate("student")
            .populate("pickedBy")
            .exec(function(err, details){
                if (err) {
                    defer.reject(err);
                } else if (details) {
                    defer.resolve(details);
                } else {
                    defer.reject(new Error('Unable to find the StudentPickupDetail'))
                }   
            });
            return defer.promise;
        },
        successHandler: function(details) {
            logger.info("StudentPickupDetail -- Read Success");
            apiServer.sendResponse(req, res, details, 'StudentPickupDetail info successfully retrieved');
        }
    });
};

exports.updateWithId = function (req, res) {
    return apiServer.apiCallHelper(req, res, {
        infoMessage: "StudentPickupDetail -- UpdateWithId",
        userValidationHandler: function(user, signatureIsValid) {
            if (user.isAdmin()) {
                return true;
            } else {
                throw new Error("U dont have Permission Dude");
            }
        },
        processHandler: function() {
            var defer = Q.defer();
            var param = JSON.parse(JSON.stringify(req.body));
            delete param["signature"];
            logger.debug("params: " + JSON.stringify(param) + "id: " + JSON.stringify(req.params.id));

            StudentPickupDetail.findOneAndUpdate({
                _id: req.params.id
            }, param, function (err, detail) {
                if (!err && detail) {
                    defer.resolve(detail);
                } else if (!detail) {
                    defer.reject(new Error("StudentPickupDetail didn't exist"));
                } else {
                    defer.reject(err);                
                }
            });
            return defer.promise;
        },
        successHandler: function(detail) {
            logger.info("StudentPickupDetail -- update Success");
            apiServer.sendResponse(req, res, detail, 'StudentPickupDetail info successfully updated');
        }
    });
}

exports.deleteWithId = function (req, res) {
    return apiServer.apiCallHelper(req, res, {
        infoMessage: "StudentPickupDetail -- UpdateWithId",
        userValidationHandler: function(user, signatureIsValid) {
            if (user.isAdmin()) {
                return true;
            } else {
                throw new Error("U dont have Permission Dude");
            }
        },
        processHandler: function() {
            var defer = Q.defer();
            logger.info("Reminders - deleteReminderById");
            logger.debug("id: " + JSON.stringify(req.params.id));

            StudentPickupDetail.findOneAndRemove({
                _id: req.params.id
            }, function (err, detail) {
                if (!err && detail) {
                    defer.resolve(null);
                } else if (!detail) {
                    defer.reject(new Error("StudentPickupDetail didn't exist"));
                } else {
                    defer.reject(err);
                }
            });
            return defer.promise;
        },
        successHandler: function(detail) {
            logger.info("StudentPickupDetail -- delete Success");
            apiServer.sendResponse(req, res, detail, 'StudentPickupDetail info successfully deleted');
        }
    });
}