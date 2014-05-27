/*
 * file: accounts.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var Q = require('q');
var nconf = require('nconf');
var auth = require('../../../middlewares/auth');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');
var Device = require('../../../../server/models/Device');

exports.login = function (req, res) {
    logger.info("AccountApi - Login");
    auth.doLogin(req, res);
};

exports.logout = function (req, res) {
    logger.info("AccountApi - Logout");
    req.session.user = null;
    apiServer.sendResponse(req, res, req.session.user, 'User successfully logged out');
};

exports.getUser = function (req, res) {
    logger.info("AccountApi - getUser");
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
    ]).then(function (result) {
        apiServer.sendResponse(req, res, result[0], 'User Information in Session');
    }).fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
};

exports.addUserDevice = function (req, res) {
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
    ]).spread(function (user, signatureIsValid) {
        var defer = Q.defer();
        Device.findOne({
            deviceUUID: req.body.uuid
        }, function (err, device) {
            if (err) defer.reject(err);
            else if (device) defer.resolve([user, device]);
            else {
                // Create a new device
                var newDevice = new Device({
                    deviceType: req.body.type,
                    deviceUUID: req.body.uuid,
                    owner: user._id,
                    pushToken: req.body.token
                });
                newDevice.save(function (err, newDevice) {
                    if (err) defer.reject(err);
                    else defer.resolve([user, newDevice]);
                });
            }
        })
        return defer.promise;
    }).spread(function (user, device) {
        var defer = Q.defer();
        user.devices.push(device._id);
        user.save(function (err, user) {
            if (err) defer.reject(err);
            else defer.resolve(device);
        });
        return defer.promise;
    }).then(function (device) {
        apiServer.sendResponse(req, res, device, 'Device successfully added/updated')
    }).fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
};

exports.updateUserDevice = function (req, res) {

};