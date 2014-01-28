/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var async = require('async');

var apiServer = require('../utils/apiServer');
var Class = require('../../../models/Class');
var User = require('../../../models/User');

exports.readClasses = function(req, res) {
    apiServer.verifySignature(req, res, findClassesByUserId);
};

exports.readStudentsByClasses = function(req, res) {
    apiServer.verifySignature(req, res, findStudentsByUserId); // todo change
}

//-----------------helpers--------------------//

function findClassesByUserId(req, res) {
    var userType = req.session.user.userType;
    if (userType < 2) {
        findClassesByAdminId(req, res);
    } else if (userType == 3) {
        findClassesByTeacherId(req, res);
    } else {
        apiServer.sendError();
        console.log("Err: Cannot find classes using student / parent id")
    }
}

function findStudentsByUserId(req, res) {
    var userType = req.session.user.userType;
    findUsersByClassIdAndUserType(req, res, "students");
}

//----------------queries--------------------//
function findClassesByTeacherId(req, res) {
    console.log("finding from teacher");
    var teacherId = req.session.user._id;
    var desc = "List all classes managed by the user";
    User.findOne({
        _id: teacherId
    }).populate('classes').exec(function(err, user) {
        if (err) {
            apiServer.sendError();
            console.log(err);
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
            apiServer.sendError();
            console.log(err);
        } else {
            apiServer.sendResponse(req, res, classes, desc);
        }
    });
}

/** 
 * classUserType : students, instructors
 */
function findUsersByClassIdAndUserType(req, res, classUserType) {
    console.log("finding users in a class");
    var classId = req.query.classId;
    var desc = "List all " + classUserType + " in that class";
    Class.findOne({
        _id: classId
    }).populate(classUserType).exec(function(err, classes) {
        if (err) {
            apiServer.sendError();
            console.log(err);
        } else {
            apiServer.sendResponse(req, res, classes[classUserType], desc);
        }
    });
}