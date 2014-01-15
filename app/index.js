/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var bcrypt = require('bcrypt');
var async = require('async');
var User = require('./models/User');

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

    var mochi = new User({
        username: "admin",
        password: "adminpw",
        userType: 1,
    });

    mochi.save(function(err, mochi) {
        if (err) {
            console.log(err);
        } else {
            console.log(mochi);
        }
    });

    res.send('see console');
}