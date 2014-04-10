/*
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */

'use strict';

var async = require('async');
var nconf = require('nconf');
var User = require('../models/User');
var Class = require('../models/Class');
var logger = require('../utils/logger');

exports.populateDB = function() {
    // populate db with test data
    // cleaning the db

    User.remove({}, function(err) {
        logger.info('User removed')
    });
    Class.remove({}, function(err) {
        logger.info('Class removed')
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
                    if (!err && newClass) {
                        teacher.classes.push(newClass._id);
                        teacher.save(function(err, teacher) {
                            done(null, newClass);
                        })
                    } else {
                        done(err);
                    }
                });
            } else {
                done(err);
            }
        });
        },
        function(newClass, done) {
            var studentArray = [];
            logger.info("classid:" + newClass._id);

            for (var i = 0; i < 100; i++) {
                var tempStudent = new User({
                    username: "student" + i,
                    password: "student" + i + "pw",
                    userType: 3,
                });
                tempStudent.save(function(err, student) {
                    if (!err && student) {
                        newClass.students.push(student._id);
                        newClass.save(function(err, newClass) {
                            if (!err && newClass) {
                                student.classes.push(newClass._id);
                                student.save(function(err, student) {
                                    done(null, student);
                                })
                            } else {
                                done(err);
                            }
                        });
                    } else {
                        done(err);
                    }
                });
            }

        }
    ]);

}