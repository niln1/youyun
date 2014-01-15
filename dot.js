/* 
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

//Vendor modules and variables
var express = require('express');
var nconf = require('nconf');
var http = require('http');
var path = require('path');
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var app;
module.exports.app = app = express();


// Local modules and variables
var routes = require('./app/routes');
var env = app.get('env');
var auth = require('./app/middlewares/auth');
var session = require('./app/middlewares/session');

/*
 * Configuration from nconf
 */
nconf.argv().env().file('./app/config.json');


app.configure(function() {
    /*
     * Setup environment
     */
    app.set('port', nconf.get('PORT'));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    /*
     * Setup middlewares
     */
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

    session(app);

    app.use(flash());

    mongoose.connect(nconf.get('MONGODB_URL'));

    var db;
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: can\'t connect to mongodb.'));

    // Global authentication middle ware
    app.use(auth.checkUserSession);
});

// TODO: put this in routes.. too lazy
// csrf()
// app.use(require('express').csrf());
// app.use(function(req, res, next) {
//     res.locals.token = req.csrfToken();
//     next();
// });

// Static file server
app.use('/static', express.static(path.join(__dirname + '/public')));

// Router
app.use(app.router);
routes.route(app);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});