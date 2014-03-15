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
    app.get('/api/:version/spec', index.getSpec);
	// Match request with path like '/api/v1/classes' for GET
	app.get('/api/:version/:object', index.getObjects);

    // TODO: depreciated
    // Match request with path like '/api/v1/classes/read' for GET
    app.get('/api/:version/:object/:action', index.getObjects);
    // Match request with path like '/api/v1/classes/students/read' for GET
    app.get('/api/:version/:object/:subobject/:action', index.getObjects);


	// Match request with path like '/api/v1/classes' for POST
	app.post('/api/:version/:object', index.postObjects);
	// TODO: depreciated
	// Match request with path like '/api/v1/classes/update' for POST
    app.post('/api/:version/:object/:action', index.postObjects);
}