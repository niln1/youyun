/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var async = require('async');
var __ = require('underscore');

var apiServer = require('../utils/apiServer');
var Class = require('../../../models/Class');
var User = require('../../../models/User');

exports.readClasses = function(req, res) {
    apiServer.verifySignature(req, res, findClassesByUserId);
};

exports.readStudentsByClasses = function(req, res) {
    apiServer.verifySignature(req, res, findStudentsByUserIdClassId); // todo change
}

//-----------------helpers--------------------//

function findClassesByUserId(req, res) {
    var userType = req.session.user.userType;
    if (userType < 2) {
        findClassesByAdminId(req, res);
    } else if (userType == 2) {
        findClassesByTeacherId(req, res);
    } else {
        apiServer.sendError(req, res);
        console.log("Err: Cannot find classes using student / parent id")
    }
}

function findClassesByTeacherId(req, res) {
    console.log("finding from teacher");
    var teacherId = req.session.user._id;
    var desc = "List all classes managed by the user";
    User.findOne({
        _id: teacherId
    }).populate('classes').exec(function(err, user) {
        if (err) {
            apiServer.sendError(req, res, err);
            console.log("[ClassAPI]Error: " + err);
        } else {
            apiServer.sendResponse(req, res, user.classes, desc);
        }
    });
}

function findClassesByAdminId(req, res) {
    console.log("finding from admin");
    var adminId = req.session.user._id;
    var desc = "List all classes ";
    Class.find().exec(function(err, classes) {
        if (err) {
            apiServer.sendError(req, res, err);
            console.log("[ClassAPI]Error: " + err);
        } else {
            apiServer.sendResponse(req, res, classes, desc);
        }
    });
}

function findStudentsByUserIdClassId(req, res) {
    console.log("finding users in a class");
    var classId = req.query.classId;
    var userId = req.session.user._id;
    var userType = req.session.user.userType;
    var classUserType = "students";
    var desc = "List all " + classUserType + " in that class";
    Class.findOne({
        _id: classId
    }).populate(classUserType).exec(function(err, classes) {
        if (err) {
            console.log("[ClassAPI]Error: " + err);
            apiServer.sendError(req, res, err);
        } else if (userType == 2) {
            if (__.contains(classes.instructors, userId)) {
                apiServer.sendResponse(req, res, classes[classUserType], desc);
            } else {
                var err = "User " + userId + " dont manage that class";
                console.log("[ClassAPI]Error: " + err);
                apiServer.sendError(req, res, err);
            }
        } else if (userType > 2) {
            var err = "Student / Parent dont manage classes";
            console.log("[ClassAPI]Error: " + err);
            apiServer.sendError(req, res, err);
        } else {
            apiServer.sendResponse(req, res, classes[classUserType], desc);
        }
    });
}