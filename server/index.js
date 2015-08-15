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
    logger.debug(req.session.user);
    if (req.session.user.userType === 4) { // is parent
        return parentIndex(req, res);
    } else {
        res.redirect('/pickupreport');
    }
};

/**
 * AccountMannagment Page, Change Password
 */
var parentIndex = exports.parentIndex = function(req, res) {
    return res.render('parent-home', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'Home',
    });
}

/**
 * AccountMannagment Page, Change Password
 */
exports.oldIndex = function(req, res) {
    return res.render('index', {
        user: req.session.user,
    });
}
/**
 * AccountMannagment Page, Change Password
 */
exports.accountManagement = function(req, res) {
    return res.render('account-management', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'Account Management',
    });
}

/**
 * User Profile Page, Change Image
 */
exports.profile = function(req, res) {
    return res.render('profile', {
        user: req.session.user,
        title: 'Account Management',
    });
};

exports.lost = function (req, res) {
    logger.warn("Path Not defined");
    return res.send(404);
};

exports.postLogin = function (req, res) {
    return auth.doLogin(req, res);
}

exports.getLogin = function (req, res) {
    if (req.session.user) return res.redirect('/');
    else req.session.user = null;

    var message = req.flash('error');
    if (!message || message.length < 1) message = null;

    return res.render('login', {
        school: 'Hanlin',
        title: 'Login',
        message: message,
        user: req.session.user 
    });
}

exports.getSignup = function (req, res) {
    if (req.session.user) return res.redirect('/');
    else req.session.user = null;

    return res.render('signup', {
        school: 'Hanlin',
        title: 'Signup',
        user: req.session.user 
    });
}

exports.logout = function (req, res) {
    logger.info("Logging out");
    req.session.user = null;
    return res.redirect('/login');
}

exports.populateDB = function (req, res) {
    db.populateDB();
    return res.send('see console');
}

exports.addChild = function (req, res) {
    db.addChild();
    return res.send('see console');
}

exports.home = function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    return res.render('home', {});
}           

exports.usermanage = function (req, res) {
    if (!req.session.user) return res.send(404);
    if (req.session.user.userType > 1) return res.send(401);
    return res.render('usermanage', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'User Management'
    });
}

exports.pickupreport = function (req, res) {
    if (!req.session.user) return res.send(404);
    if (req.session.user.userType > 1) return res.send(401);
    return res.render('pickupreport', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'Pickup Report'
    });
}

exports.styleguide = function (req, res) {
    if (!req.session.user) return res.send(404);
    if (req.session.user.userType > 1) return res.send(401);
    return res.render('styleguide', {
        user: req.session.user,
        school: 'Hanlin',
        title: 'StyleGuide'
    });
}