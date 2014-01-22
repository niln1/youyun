/*
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */

'use strict';

var async = require('async');
var nconf = require('nconf');
var User = require('../models/User');
var Class = require('../models/Class');

exports.populateDB = function() {
    // populate db with test data
    // cleaning the db
    User.remove({}, function(err) {
        console.log('User removed')
    });
    Class.remove({}, function(err) {
        console.log('Class removed')
    });

    //testuser

    async.waterfall([

        function(done) {
            var tempAdmin = new User({
                username: "admin",
                password: "adminpw",
                userType: 0,
            });
            tempAdmin.save(function(err, admin) {
                done(err);
            });
        },
        function(done) {
            var tempClass = new Class({
                className: "初一1班"
            });
            tempClass.save(function(err, newClass) {
                done(err, newClass);
            });
        },
        function(newClass, done) {
            var tempTeacher = new User({
                username: "teacher",
                password: "teacherpw",
                userType: 2,
            });
            tempTeacher.save(function(err, teacher) {
                if (!err && teacher) {
                    newClass.instructors.push(teacher._id);
                    newClass.save(function(err, newClass) {
                        teacher.classes.push(newClass._id);
                        teacher.save(function(err, teacher) {
                            done(null, teacher);
                        })
                    });
                } else {
                    done(err);
                }
            });
        }
    ]);

    /*
    tempClass.save(function(err, tempClass) {
        if (err) {
            console.log(err);
        } else {
            console.log(tempClass);
        }
    });
    var studentArray = [];

    for (var i = 0; i < 100; i++) {
        var tempStudent = new User({
            username: "student" + i,
            password: "student" + i + "pw",
            userType: 3,
        });
        studentArray.push(tempStudent);
    }

    tempAdmin.save(function(err, tempAdmin) {
        if (err) {
            console.log(err);
        } else {
            console.log(tempAdmin);
        }
    });

    tempTeacher.save(function(err, tempTeacher) {
        if (err) {
            console.log(err);
        } else {
            console.log(tempTeacher)
        }
    });

    for (tempStudent in studentArray) {
        tempStudent.save(function(err, tempStudent) {
            if (err) {
                console.log(err);
            } else {
                console.log(tempStudent);
            }
        });
    };

    */
}