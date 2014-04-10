/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var User = require('../../../models/User');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');
var __ = require('underscore');

exports.createUser = function(req, res) {
    apiServer.verifySignature(req, res, createUserWithMessage)
}

exports.readUsers = function(req, res) {
    apiServer.verifySignature(req, res, findUsersByUserId)
}

exports.updateUserWithId = function(req, res) {
    apiServer.verifySignature(req, res, updateUserById)
}

exports.deleteUserWithId = function(req, res) {
    apiServer.verifySignature(req, res, deleteUserById)
}

//-----------------helpers--------------------//


function findUsersByUserId(req, res) {
    logger.info("Users - findUsersByUserId");
    logger.debug("userId: " + JSON.stringify(req.session.user._id));
    User.find({}, function(err, users) {
        if (!err && users) {
            users = castOutPassword(users);
            apiServer.sendResponse(req, res, users, 'Users retrieved successfully');
        } else if (!users) {
            apiServer.sendError(req, res, "Users not found");
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}

function castOutPassword(users) {
    __.each(users, function(user) {
        user.password = "Black Sheep Wall";
    });
    return users;
}