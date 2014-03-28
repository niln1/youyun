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
	app.get('/api/:version/:object', index.findObject);

    // TODO: depreciated
    // Match request with path like '/api/v1/classes/read' for GET
    app.get('/api/:version/:object/:action', index.findObject);
    // Match request with path like '/api/v1/classes/students/read' for GET
    app.get('/api/:version/:object/:subobject/:action', index.findObject);


	// Match request with path like '/api/v1/classes' for POST
	app.post('/api/:version/:object', index.createObject);
	// TODO: depreciated
	// Match request with path like '/api/v1/classes/update' for POST
    app.post('/api/:version/:object/:action', index.createObject);

//	app.put('/api/:version/:object/:id', index.updateObjectWithId);
	app.patch('/api/:version/:object/:id', index.updateObjectWithId);
//	app.delete('/api/:version/:object/:id', index.deleteObject);
}