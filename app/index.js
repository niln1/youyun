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