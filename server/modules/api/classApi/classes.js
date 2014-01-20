/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var apiServer = require('../utils/apiServer');
var UserClass = require('../../..//models/UserClass');
var Class = require('../../..//models/Class');


exports.readClasses = function(req, res) {
    console.log(JSON.stringify(req.path));
    console.log(JSON.stringify(req.url));

    var findClassById = function(req, res) {
        var teacherId = req.session.user._id;
        UserClass.find({
            userId: teacherId,
        }, function(err, data) {
            if (err) console.log(err);
            var tempUserClass = data;
            Class.findById(tempUserClass[0].classId, function(err, docs) {
                console.log(tempUserClass.classId);
                res.send(docs);
            })
        });
    };

    apiServer.verifySignature(req, res, findClassById);
    // apiServer.get(req, res, '/api/object/classes', 'get', 1);
};