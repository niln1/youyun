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

exports.main = function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    // checking if user image exists
    var userImageUrl = "static/img/user_image/" + req.session.user._id + "_" + req.session.user.username + ".png";
    logger.debug(userImageUrl);
    var defaultImageUrl = "static/img/default_image/default-user.png";
    fs.exists(userImageUrl, function(exists) {
        if (exists) {
            req.session.user.user_image = userImageUrl;
        } else {
            req.session.user.user_image = defaultImageUrl;
        }
        res.render('index', {
            user: req.session.user
        });
    });
};

exports.lost = function(req, res) {
    logger.warn("Path Not defined");
    res.send(404);
};

exports.postLogin = function(req, res) {
    auth.doLogin(req, res);
}

exports.getLogin = function(req, res) {
    if (req.session.user) return res.redirect('/');
    else req.session.user = null;

    var message = req.flash('error');
    if (!message || message.length < 1) message = null;

    res.render('login', {
        title: 'Login',
        message: message,
        user: req.session.user 
    });
}

exports.logout = function(req, res) {
    logger.info("Logging out");
    req.session.user = null;
    res.redirect('/login');
}

exports.populateDB = function(req, res) {
    db.populateDB();
    res.send('see console');
}

exports.home = function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    res.render('home', {});
}