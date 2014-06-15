/*
* Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
*/
'use strict';

var User = require('../../../models/User');
var StudentPickupReport = require('../../../models/StudentPickupReport');
var mongoose = require('mongoose');

var querys = require('../utils/querys');

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
    .then(querys.initStudentPickupReport)
    .then(function (students) {
        apiServer.sendResponse(req, res, students, 'StudentPickupReport info successfully retrieved')
    })
    .fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}

exports.read = function (req, res) {}

exports.readCurrent = function (req, res) {}

exports.addAbsence = function (req, res) {}
