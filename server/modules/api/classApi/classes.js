/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var async = require('async');

var apiServer = require('../utils/apiServer');
var Class = require('../../../models/Class');

exports.readClasses = function(req, res) {
    apiServer.verifySignature(req, res, findClassManagedById);
};

function findClassByUserId(req, res) {
    var teacherId = req.session.user._id;
    var desc = "List all class managed by the User";
    UserClass.find({
        userId: teacherId,
    }, function(err, data) {
        if (err) {
            apiServer.sendError();
            console.log(err);
        }
        for (var tempUserClass in data) {

        }
    });
};

function findClassByClassId(req, res) {
    Class.findById(tempUserClass.classId, function(err, docs) {
        console.log(tempUserClass.classId);

    })
}