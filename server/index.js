/*
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var async = require('async');
var nconf = require('nconf');
var User = require('./models/User');
var db = require('./databases/db');

function userAuthenticationFailed(req, res, message) {
    req.flash('error', message); // TODO
    return res.redirect('/login');
}

exports.main = function(req, res) {
    console.log(nconf.get('VERSION'));

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

exports.populateDB = function(req, res) {
    db.populateDB();
    res.send('see console');
}