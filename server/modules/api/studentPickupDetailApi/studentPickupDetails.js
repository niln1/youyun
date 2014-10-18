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
    return apiCallHelper(req, res, {
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
            var defer = Q.defer();
            // do some thing
            logger.debug("Param: studentId: " + req.body.studentId);
            var newStudentPickupDetail = new StudentPickupDetail({
                student: req.body.studentId,
            })

            newStudentPickupDetail.save(function (err, detail) {
                if (err) defer.reject(err);
                defer.resolve(detail);
            });
            return defer.promise;
        },
        successHandler: function(detail) {
            logger.info("StudentPickupDetail -- Create Success");
            apiServer.sendResponse(req, res, detail, 'StudentPickupDetail info successfully Created');
        }
    });}

exports.read = function (req, res) {
    return apiCallHelper(req, res, {
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
    return apiCallHelper(req, res, {
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
    return apiCallHelper(req, res, {
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

/**
 * General Api call Wrapper to reduce redendent code
 * @param  {object} req needed
 * @param  {object} res needed
 * @param  {object} opt needed
 */
 function apiCallHelper (req, res, opt) {

    var opt = opt || {};

    // check options
    if (!opt.infoMessage) {
        logger.warn("Missing infoMessage");
        return;
    } else if (!opt.userValidationHandler) {
        logger.warn("Missing userValidationHandler");
        return;
    } else if (!opt.processHandler) {
        logger.warn("Missing processHandler");
        return;
    } else if (!opt.successHandler) {
        logger.warn("Missing successHandler");
        return;
    }

    // start helper
    logger.info(opt.infoMessage);
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
        ])
    .spread(function (user, signatureIsValid) {
        return opt.userValidationHandler(user, signatureIsValid);
    })
    .then(function(hasPermission){
        return opt.processHandler(hasPermission);
    })
    .then(function(data){
        return opt.successHandler(data);
    })
    .fail(function(err){
        if (opt.errorHandler) {
            return opt.errorHandler(err);
        } else {
            logger.warn(err);
            apiServer.sendBadRequest(req, res, err.toString());
        }
    });
}