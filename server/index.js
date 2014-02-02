/*
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var async = require('async');
var nconf = require('nconf');
var db = require('./databases/db');
var auth = require('./middlewares/auth');

exports.main = function(req, res) {
    console.log(nconf.get('VERSION'));
    console.log(nconf.get('ENV'))
    res.render('index', {});
};

exports.lost = function(req, res) {
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