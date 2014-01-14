/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

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

exports.postLogin = function(req, res) {}

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