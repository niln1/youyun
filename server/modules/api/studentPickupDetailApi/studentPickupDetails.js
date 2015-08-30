/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */
 'use strict';

 var StudentPickupDetail = require('../../../models/StudentPickupDetail');
 var StudentParent = require('../../../models/StudentParent');
 var User = require('../../../models/User');
 var apiServer = require('../utils/apiServer');
 var logger = require('../../../utils/logger');
 var mongoose = require('mongoose');


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
            var defer = Q.defer();
            if (req.body.studentId) {

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
                logger.debug("Param: group: " + req.body.pickupGroup);

                var data = JSON.parse(JSON.stringify(req.body)); // create a simple clone just for the data
                delete data.signature;
                delete data.pickupGroup;

                User.findStudentsByPickupLocation(req.body.pickupGroup)
                .then(function (users){
                    var promises = [];
                    logger.debug('Populating promises with ' + users.length + ' users');

                    users.forEach(function(user){
                        var pickupData = data;
                        pickupData.student = user._id;
                        promises.push(StudentPickupDetail.createWithData(pickupData)); 
                    })

                    return Q.all(promises);
                }).then(function(data){
                    logger.debug('success');
                    defer.resolve(data);
                }).fail(function(data){
                    logger.fatal('fail');
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
            var defer = Q.defer();

            if (user.isAdmin()) {
                defer.resolve(true);
            } else if(user.isParent()){
                //for parent user, they will only have permission if they are the parent of given child
                var studentId = req.query.studentId;
                //parent user not allowed to get pickup info of other children
                if(!studentId) {
                    defer.reject(new Error('U dont have Permission Dude'));
                }

                StudentParent.count({
                    student: mongoose.Types.ObjectId(req.query.studentId),
                    parent: mongoose.Types.ObjectId(user._id)
                }, function (err, count) {
                    if (err) {
                        logger.debug('error');
                        defer.reject(new Error('U dont have Permission Dude'));
                    }else {
                        logger.debug('the count ' + count);
                        if(count > 0) {
                            defer.resolve(true);
                        } else {
                            defer.reject(new Error('U dont have Permission Dude'));
                        }
                    }
              });
            } else {
                defer.reject(new Error('U dont have Permission Dude'));
            }
            return defer.promise;
        },
        processHandler: function() {
            var defer = Q.defer();

            var queryObject ={};
            var studentId = req.query.studentId;
            if(studentId) {
                queryObject['student'] = mongoose.Types.ObjectId(studentId);
            }

            StudentPickupDetail.find(queryObject)
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