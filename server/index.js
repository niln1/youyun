/*
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var async = require('async');
var nconf = require('nconf');
var fs = require('fs');
var db = require('./databases/db');
var auth = require('./middlewares/auth');
var logger = require('./utils/logger');
var userApiHelper = require('./modules/api/userApi/users.js').helpers;

exports.main = function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    logger.warn(req.session.user);
    if (req.session.user.userType > 1 ) {
        res.render('account-management', {
            user: req.session.user,
            school: 'Hanlin',
            title: 'Account Management',
        });
    } else {
        res.redirect('/pickupreport');

    }
};

exports.lost = function (req, res) {
    logger.warn("Path Not defined");
    res.send(404);
};

exports.postLogin = function (req, res) {
    auth.doLogin(req, res);
}

exports.getLogin = function (req, res) {
    if (req.session.user) return res.redirect('/');
    else req.session.user = null;

    var message = req.flash('error');
    if (!message || message.length < 1) message = null;

    res.render('login', {
        school: 'Hanlin',
        title: 'Login',
        message: message,
        user: req.session.user 
    });
}

exports.logout = function (req, res) {
    logger.info("Logging out");
    req.session.user = null;
    res.redirect('/login');
}

exports.populateDB = function (req, res) {
    db.populateDB();
    res.send('see console');
}

exports.addChild = function (req, res) {
    db.addChild();
    res.send('see console');
}

exports.home = function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    res.render('home', {});
}           

exports.usermanage = function (req, res) {
    if (!req.session.user) return res.send(404);
    if (req.session.user.userType > 1) return res.send(401);
    res.render('usermanage', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'User Management'
    });
}

exports.pickupreport = function (req, res) {
    if (!req.session.user) return res.send(404);
    if (req.session.user.userType > 1) return res.send(401);
    res.render('pickupreport', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'Pickup Report'
    });
}

exports.styleguide = function (req, res) {
    if (!req.session.user) return res.send(404);
    if (req.session.user.userType > 1) return res.send(401);
    res.render('styleguide', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'StyleGuide'
    });
}