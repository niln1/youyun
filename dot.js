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

/*
 * Configuration from nconf
 */
nconf.argv().env().file('./server/utils/config.json');

// Local modules and variables
var routes = require('./server/routes');
var socketRoutes = require('./server/socket-routes');
var auth = require('./server/middlewares/auth');
var session = require('./server/middlewares/session');
var logger = require('./server/utils/logger');

/*
 * Setup environment
 */
var env = nconf.get('env');
process.env.NODE_ENV = env;
app.set('env', nconf.get('env'))
app.set('port', nconf.get('port'));
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'jade');

/*
 * Setup middlewares
 */
app.use(express.logger('dev'));

app.use(express.json({
    strict: true
}));

app.use(express.urlencoded());
app.use(express.methodOverride());

session(app);

app.use(flash());

mongoose.connect(nconf.get('mongodb-url'));

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

var server = app.listen(app.get('port'), function() {
    logger.info("LogLevel - " + nconf.get('log-level'));
    logger.info('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' environment.');
});
var io = require('socket.io').listen(server);
socketRoutes.route(io, app.get('session-store'), app.get('cookie-parser'));