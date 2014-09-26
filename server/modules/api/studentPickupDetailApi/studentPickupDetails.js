/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */
'use strict';

var StudentPickupDetail = require('../../../models/StudentPickupDetail');
var User = require('../../../models/User');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');

exports.create = function (req, res) {
    apiServer.verifySignature(req, res, createReminderWithMessage)
}

exports.read = function (req, res) {
    apiServer.verifySignature(req, res, findRemindersByUserId)
}

exports.updateWithId = function (req, res) {
    apiServer.verifySignature(req, res, updateReminderById)
}

exports.deleteWithId = function (req, res) {
    apiServer.verifySignature(req, res, deleteReminderById)
}