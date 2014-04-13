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
    // Match login
    app.get('/api/:version/account/login', index.readObject);
    app.post('/api/:version/account/logout', index.createObject);

    // Specs
    app.get('/api/:version/spec', index.getSpec);

    // Read
    app.get('/api/:version/:object', index.readObject);
    app.get('/api/:version/:object/:subobject', index.readObject);

    // Create
    app.post('/api/:version/:object', index.createObject);
    app.post('/api/:version/:object/:subobject', index.createObject);

    // Update
    app.patch('/api/:version/:object/:id', index.updateObjectWithId);

    // Delete
    app.delete('/api/:version/:object/:id', index.deleteObjectWithId);
}