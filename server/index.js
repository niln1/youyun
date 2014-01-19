/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var bcrypt = require('bcrypt');
var async = require('async');
var User = require('./models/User');
var Class = require('./models/Class');
var UserClass = require('./models/UserClass');

function userAuthenticationFailed(req, res, message) {
    req.flash('error', message); // TODO
    return res.redirect('/login');
}

exports.main = function(req, res) {
    return res.render('index', {
        env: process.env.NODE_ENV
    });
};

exports.lost = function(req, res) {
    return res.render('index', {
        env: process.env.NODE_ENV
    });
};

exports.postLogin = function(req, res) {
    if (!req.body.username || !req.body.password) {
        return userAuthenticationFailed(req, res, '用户名或者密码不能为空');
    }

    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err || !user) return userAuthenticationFailed(req, res, '用户名或者密码错误');

        user.comparePassword(req.body.password, function(err, match) {
            if (err || !match) return userAuthenticationFailed(req, res, '用户名或者密码错误');

            req.session.user = user;
            res.redirect('/');
        });
    });
}

exports.getLogin = function(req, res) {
    if (req.session.user) return res.redirect('/');
    else req.session.user = null;

    var message = req.flash('error');
    if (!message || message.length < 1) message = null;

    res.render('login', {
        title: 'Login',
        message: message,
        user: req.user 
    });
}

exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/login');
}

exports.test1 = function(req, res) {

    // cleaning the db
    User.remove({}, function(err) {
        console.log('User removed')
    });
    Class.remove({}, function(err) {
        console.log('Class removed')
    });
    UserClass.remove({}, function(err) {
        console.log('UserClass removed')
    });

    //testuser

    var tempArray = [];

    var tempClass = new Class({
        className: "初一1班"
    });
    console.log(JSON.stringify(Class));

    tempClass.save(function(err, tempClass) {
        if (err) {
            console.log(err);
        } else {
            console.log(tempClass);
        }
    });

    var tempAdmin = new User({
        username: "admin",
        password: "adminpw",
        userType: 0,
    });

    var tempTeacher = new User({
        username: "teacher",
        password: "teacherpw",
        userType: 2,
    });

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
            tempArray.push(tempTeacher);
            var tempUserClass = new UserClass({
                userId: tempTeacher._id,
                classId: tempClass._id
            });
            tempUserClass.save(function(err, tempUserClass) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(tempUserClass);
                }
            });
        }
    });


    for (var i = 0; i < 100; i++) {
        var tempStudent = new User({
            username: "student" + i,
            password: "student" + i + "pw",
            userType: 3,
        });
        tempStudent.save(function(err, tempStudent) {
            if (err) {
                console.log(err);
            } else {
                var tempUserClass = new UserClass({
                    userId: tempStudent._id,
                    classId: tempClass._id
                });
                tempUserClass.save(function(err, tempUserClass) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(tempUserClass);
                    }
                });
            }
        });
    }
    res.send('see console');
}