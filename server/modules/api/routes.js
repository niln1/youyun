/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var index = require('./index');

exports.route = function(app) {
    /** Naming convention for api: CRUD
     *  C: create
     *  R: read
     *  U: update
     *  D: delete
     */
    // Match request with path like '/api/v1/classes/read' for GET
    app.get('/api/:version/:object/:action', index.getObjects);

    // Match request with path like '/api/v1/classes/update' for POST
    app.post('/api/:version/:object/:action', index.postObjects);

    app.get('/api/get_class', function(req, res) {
        console.log(req.query);
        var teacherId = req.session.user._id;
        UserClass.find({
            userId: teacherId,
        }, function(err, data) {
            if (err) console.log(err);
            var tempUserClass = data;
            Class.findById(tempUserClass[0].classId, function(err, docs) {
                console.log(tempUserClass.classId);
                res.send(docs);
            })
        });
    });
}