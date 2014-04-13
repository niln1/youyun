/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var User = require('../../../models/User');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');
var path = require('path')
var fs = require('fs');
var __ = require('underscore');

exports.createUser = function(req, res) {
    apiServer.verifySignature(req, res, createUserHelper);
}

exports.readUsers = function(req, res) {
    apiServer.verifySignature(req, res, findUsersByUserId);
}

exports.updateUserWithId = function(req, res) {
    apiServer.verifySignature(req, res, updateUserById);
}

exports.deleteUserWithId = function(req, res) {
    apiServer.verifySignature(req, res, deleteUserById);
}

exports.createUserImage = function(req, res) {
    apiServer.verifySignature(req, res, createUserImageHelper);
}

//-----------------helpers--------------------//

function createUserImageHelper(req, res) {
    logger.info("Users - createUserImageHelper");
    logger.debug("user: " + JSON.stringify(req.session.user));
    var filePath = req.files.userImage.path;
    var extension = path.extname(filePath);

    //TODO: convert file to png.
    fs.readFile(filePath, function(err, data) {
        logger.info("sasa" + extension);
        var newPath = "static/img/user_image/a" + extension;
        fs.writeFile(newPath, data, function(err) {
            if (err) throw err;
            console.log('It\'s saved!');
            apiServer.sendResponse(req, res, null, 'User Image uploaded');
        });
    });
}

function createUserHelper(req, res) {
    if (req.body.classList) {
        logger.debug("not implemented");
    } else {
        createUserWithoutClasses(req, res);
    }
}

function createUserWithoutClasses(req, res) {
    logger.info("Users - createUserWithoutClasses");
    logger.debug("username: " + JSON.stringify(req.body.username) + ", usertype: " + JSON.stringify(req.body.userType));
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        userType: req.body.userType,
    });
    newUser.save(function(err, user) {
        if (!err && user) {
            user = castOutPassword(user);
            apiServer.sendResponse(req, res, user, 'User created successfully');
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}


function findUsersByUserId(req, res) {
    logger.info("Users - findUsersByUserId");
    logger.debug("userId: " + JSON.stringify(req.session.user._id));
    User.find({}, function(err, users) {
        if (!err && users) {
            users = castOutPasswords(users);
            apiServer.sendResponse(req, res, users, 'Users retrieved successfully');
        } else if (!users) {
            apiServer.sendError(req, res, "Users not found");
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}

function castOutPasswords(users) {
    __.each(users, function(user) {
        user = castOutPassword(user);
    });
    return users;
}

function castOutPassword(user) {
    user.password = "Black Sheep Wall";
    return user;
}