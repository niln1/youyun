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

function findClassesByUserId(req, res) {
    var teacherId = req.session.user._id;
    console.log(teacherId);
    var desc = "List all class managed by the User";
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