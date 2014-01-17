/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

exports.route = function(app) {
    app.get('/api', function(req, res) {
        console.log(req.body);
        res.send("in get class");
    });
    app.get('/api/get_class', function(req, res) {
        console.log("_hello");
        res.send("in get class");
    });
}