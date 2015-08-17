/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var User = require('../../../models/User');
var StudentParent = require('../../../models/StudentParent');
var mongoose = require('mongoose');

var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');
var path = require('path')
var fs = require('fs');
var gm = require('gm');
var __ = require('underscore');
var Q = require('q');

exports.createUser = function (req, res) {
    apiServer.verifySignature(req, res, createUserHelper);
}

exports.readUsers = function (req, res) {
    apiServer.verifySignature(req, res, findUsers);
}

exports.updateUserWithId = function (req, res) {
    apiServer.verifySignature(req, res, updateUserById);
}

exports.updateUserImage = function (req, res) {
    apiServer.verifySignature(req, res, updateUserImageHelper);
}

exports.deleteUserWithId = function (req, res) {
    logger.info("Users - deleteUserWithId");
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
        ])
    .spread(function (user, signatureIsValid) {
        if (user.isAdmin() && signatureIsValid){
            return true;
        } else {
            throw new Error("Stay away you muggles!");
        }
    })
    .then(function(hasPermission){
        var defer = Q.defer();

        logger.debug("User to delete is: " + req.params.id);

        User.findOneAndRemove({_id: req.params.id}, function(err, deletedUser){
            if (err) {
                defer.reject(err);
            } else if (deletedUser) {
                defer.resolve(deletedUser);
            } else {
                defer.reject(new Error('Unable to find the user'))
            }   
        });
        return defer.promise;
    })
    .then(function(deletedUser){
        apiServer.sendResponse(req, res, deletedUser, 'User deleted successfully');
    })
    .fail(function(err){
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}

exports.getChild = function (req, res) {
    logger.info("Users - getChild");
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
    ])
    .spread(function (user, signatureIsValid) {

        if (user.userType < 3 || user._id.toString() === req.query.userId) {
            if (req.query.userId && signatureIsValid) return true;
            else throw new Error('userId must be specified.');
        } else {
            console.log('no permission')
            throw new Error("You don't have permission to read child information for this user.");
        }
    })
    .then(function (hasPermissionToRead) {
        var parentId = mongoose.Types.ObjectId(req.query.userId);
        var defer = Q.defer();

        StudentParent.find({
            parent: parentId
        })
        .populate('student')
        .exec(function (err, childRelations) {
            if (err) defer.reject(err);
            else if (childRelations.length === 0) defer.reject(new Error('Can\' find children for parent with id ' + req.query.userId + '.'));
            else {
                childRelations = __.map(childRelations, function (relation) {
                    return castOutPassword(relation.student);
                });
                defer.resolve(childRelations);
            }
        })

        return defer.promise;
    })
    .then(function (students) {
        apiServer.sendResponse(req, res, students, 'Children info successfully retrieved')
    })
    .fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}

exports.addChild = function (req, res) {
    logger.info("Users - addChild");
    Q.all([
        apiServer.validateUserSession(req, res),
        apiServer.validateSignature(req, res)
    ])
    .spread(function (user, signatureIsValid) {

        if (user.userType !==3 && user.userType !== 5 && user._id.toString() === req.body.userId) {
            if (req.body.userId && signatureIsValid) return true;
            else throw new Error('userId must be specified.');
        } else {
            console.log('no permission')
            throw new Error("You don't have permission to add child");
        }
    })
    .then(function () {
        var defer = Q.defer();

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var pickupLocation = req.body.pickupLocation;

        generateUsernameByFnLn(firstname, lastname, 1).then(function(username) {
            logger.debug("username: " + username);
            var newUser = new User({
                username: username,
                password: 'fakepassword',
                firstname: firstname,
                lastname: lastname,
                pickupLocation: pickupLocation,
                userType: 3
            });
 
            newUser.save(function (err, user) {
                if (!err && user) {
                    user = castOutPassword(user);
                    var studentParent = new StudentParent({
                        student: mongoose.Types.ObjectId(user._id),
                        parent: mongoose.Types.ObjectId(req.body.userId)
                    });
                    studentParent.save(function(err, studentParent) {
                        if(!err && studentParent) {
                            apiServer.sendResponse(req, res, user, 'User created successfully');
                        }else {
                            apiServer.sendError(req, res, err);
                        }
                    });
                } else {
                    apiServer.sendError(req, res, err);
                }
            });
        });


        return defer.promise;
    })
    .then(function (student) {
        apiServer.sendResponse(req, res, student, 'successfully added child')
    })
    .fail(function (err) {
        logger.warn(err);
        apiServer.sendBadRequest(req, res, err.toString());
    });
}


//-----------------helpers--------------------//

function updateUserById(req, res) {
    logger.info("Users - updateUserById");
    var param = JSON.parse(JSON.stringify(req.body));
    delete param["signature"];
    logger.debug("params: " + JSON.stringify(param) + "id: " + JSON.stringify(req.params.id));

    User.findOneAndUpdate({
        _id: req.params.id
    }, param, function (err, user) {
        if (!err && user) {
            apiServer.sendResponse(req, res, "success", 'user updated successfully');
        } else if (!user) {
            apiServer.sendError(req, res, "user didn't exist");
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}

function updateUserImageHelper(req, res) {
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
    newUser.save(function (err, user) {
        if (!err && user) {
            user = castOutPassword(user);
            apiServer.sendResponse(req, res, user, 'User created successfully');
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}

function findUsers(req, res) {
    logger.info("Users - findUsers");
    var param = JSON.parse(JSON.stringify(req.query));
    delete param["signature"];
    logger.debug("userId: " + JSON.stringify(req.session.user._id));
    logger.debug("param: " + JSON.stringify(param));
    var callback = function (err, users) {
        if (!err && users) {
            users = formatUsers(users);
            apiServer.sendResponse(req, res, users, 'Users retrieved successfully');
        } else if (!users) {
            apiServer.sendError(req, res, "Users not found");
        } else {
            apiServer.sendError(req, res, err);
        }
    };
    User.findByOptions({ userType: param.userType, isPickUp: param.isPickUp}, callback);
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

function generateUsernameByFnLn( firstname, lastname, hit ) {
    var self = this;
    var string1 = firstname.replace(/\s+/g, '').replace(",", ".");
    var string2 = lastname.replace(/\s+/g, '').replace(",", ".");

    var testUsername = string1.toLowerCase() + '.' + string2.toLowerCase() + hit;

    var deferred = Q.defer();

    User.find({"username":testUsername}, function(err, users){
        if (err) deferred.reject(err);
        if ( users.length === 0 ) {
            deferred.resolve(testUsername);
        } else {
            console.log("++++++++++USERNAME EXIST+++++++++");
            deferred.resolve(generateUsernameByFnLn(firstname, lastname, hit + 1));
        }
    });

    return deferred.promise;
}