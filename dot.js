/* 
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

//Vendor modules and variables
var express = require('express');
var nconf = require('nconf');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var swagger = require("swagger-node-express");
var helmet = require('helmet');

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
var helper = require('./server/middlewares/helper');
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
app.use(helmet());

app.use(helmet.csp({
  defaultSrc: ["'self' 'unsafe-inline' 'unsafe-eval'"],
  connectSrc: ["'self' " + nconf.get('socket-url') + ""],
  reportUri: '/report-violation',
  reportOnly: false, // set to true if you only want to report errors
  setAllHeaders: false, // set to true if you want to set all headers
  safari5: false // set to true if you want to force buggy CSP in Safari 5
}));

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//change this since this is depreciated
app.use(express.multipart());
app.use(express.methodOverride());
session(app);

// Global authentication middle ware
app.use(auth.checkUserSession);

// csrf()
// app.use(require('express').csrf());
app.use(helper.loadEnvironment);

app.use(helper.logErrors);
app.use(helper.clientErrorHandler);
app.use(helper.errorHandler);

/*
 * Setup mongoose
 */
mongoose.connect(nconf.get('mongodb-url'));

var db = mongoose.connection;
db.on('error', logger.error.bind(logger, 'connection error:'));

// Static file server
if (env == 'development') {
    app.use('/', express.static('development'));
    app.use('/static', express.static('static'));
} else if (env == 'production') {
    app.use('/', express.static('production'));
    app.use('/static', express.static('static'));
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