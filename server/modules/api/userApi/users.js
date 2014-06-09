/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var User = require('../../../models/User');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');
var path = require('path')
var fs = require('fs');
var gm = require('gm');
var __ = require('underscore');

exports.createUser = function (req, res) {
    apiServer.verifySignature(req, res, helpers.createUserHelper);
}

exports.readUsers = function (req, res) {
    apiServer.verifySignature(req, res, helpers.findUsersByUserId);
}

exports.updateUserWithId = function (req, res) {
    apiServer.verifySignature(req, res, helpers.updateUserById);
}

exports.deleteUserWithId = function (req, res) {
    apiServer.verifySignature(req, res, helpers.deleteUserById);
}

exports.updateUserImage = function (req, res) {
    apiServer.verifySignature(req, res, helpers.updateUserImageHelper);
}

//-----------------helpers--------------------//

var helpers = {};

helpers.updateUserImageHelper = function (req, res) {
    logger.info("Users - updateUserImageHelper");
    logger.debug("user: " + JSON.stringify(req.session.user));
    var filePath = req.files.userImage.path;
    var savePath = 'static/img/user_image/' + req.session.user._id + "_" + req.session.user.username + '.png';

    gm(filePath)
        .resize(240)
        .write(savePath, function (err) {
            if (err) {
                logger.error("Error saving user image at" + savePath);
                apiServer.sendError(req, res, err);
            } else {
                logger.debug("Successfully saved user image at" + savePath);

                User.findOneAndUpdate({
                    _id: req.session.user._id
                }, {
                    userImage: savePath
                }, function (err, user) {
                    if (!err && user) {
                        apiServer.sendResponse(req, res, castOutPassword(user), 'User Image updated successfully');
                    } else if (!user) {
                        apiServer.sendError(req, res, "User didn't exist");
                    } else {
                        apiServer.sendError(req, res, err);
                    }
                });
            }
            fs.unlink(filePath, function (err) {
                if (err) {
                    logger.error("Error deleting temp user image at" + filePath);
                    apiServer.sendError(req, res, err);
                }
                logger.debug("Successfully deleted temp user image at" + filePath);
            });
        });

}

helpers.createUserHelper = function (req, res) {
    if (req.body.classList) {
        logger.debug("not implemented");
    } else {
        createUserWithoutClasses(req, res);
    }
}

helpers.createUserWithoutClasses = function (req, res) {
    logger.info("Users - createUserWithoutClasses");
    logger.debug("username: " + JSON.stringify(req.body.username) + ", usertype: " + JSON.stringify(req.body.userType));
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        userType: req.body.userType,
    });
    newUser.save(function (err, user) {
        if (!err && user) {
            user = castOutPassword(user);
            apiServer.sendResponse(req, res, user, 'User created successfully');
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}


helpers.findUsersByUserId = function (req, res) {
    logger.info("Users - findUsersByUserId");
    logger.debug("userId: " + JSON.stringify(req.session.user._id));
    User.find({}, function (err, users) {
        if (!err && users) {
            users = formatUsers(users);
            apiServer.sendResponse(req, res, users, 'Users retrieved successfully');
        } else if (!users) {
            apiServer.sendError(req, res, "Users not found");
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}

function formatUsers(users) {
    __.each(users, function (user) {
        user = castOutPassword(user);
    });
    return users;
}

function castOutPassword(user) {
    user.password = "Black Sheep Wall";
    return user;
}

exports.helpers = helpers;