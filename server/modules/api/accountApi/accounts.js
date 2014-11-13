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
            token: req.body.token,
            owner: user._id,
            deviceType: req.body.type
        }, function (err, device) {
            if (err) defer.reject(err);
            else if (device) defer.resolve([user, device]);
            else {
                // Create a new device
                var newDevice = new Device({
                    deviceType: req.body.type,
                    token: req.body.token,
                    owner: user._id,
                });
                newDevice.save(function (err, newDevice) {
                    if (err) defer.reject(err);
                    else defer.resolve([user, newDevice]);
                });
            }
        })
        return defer.promise;
    }).spread(function (user, device) {
        return user.addDevice(device);
    }).then(function (user) {
        logger.info('Device updated' + JSON.stringify(user));
        apiServer.sendResponse(req, res, user, 'Device successfully added/updated')
    }).fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
};

exports.updateUserDevice = function (req, res) {

};