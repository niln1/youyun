/* 
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

//Vendor modules and variables
var express = require('express');
var nconf = require('nconf');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var app;
module.exports.app = app = express();


// Local modules and variables
var routes = require('./server/routes');
var auth = require('./server/middlewares/auth');
var session = require('./server/middlewares/session');

/*
 * Configuration from nconf
 */
nconf.argv().env().file('./server/config.json');

/*
 * Setup environment
 */

var env = nconf.get('ENV')
app.set('env', nconf.get('ENV'))
app.set('port', nconf.get('PORT'));
app.set('views', path.join(__dirname, 'server', 'views'));
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

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Global authentication middle ware
app.use(auth.checkUserSession);

// TODO: put this in routes.. too lazy
// csrf()
// app.use(require('express').csrf());
app.use(function(req, res, next) {
    // res.locals.token = req.csrfToken();
    res.locals.env = env;
    next();
});

// Static file server
if (env == 'development') {
    app.use('/', express.static('development'));
} else if (env == 'production') {
    app.use('/', express.static('production'));
}

// Router
app.use(app.router);
routes.route(app);

// development only
if ('development' == env) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' environment.');
});