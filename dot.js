/*
 * Vendor modules and variables
 */
var express = require('express');
var nconf = require('nconf');
var http = require('http');
var path = require('path');
var app;
module.exports.app = app = express();

/*
 * Local modules and variables
 */
var routes = require('./app/routes');
var env = app.get('env');

/*
 * Configuration from nconf
 */
nconf.argv().env().defaults({
    'PORT': 3000,
    'COOKIE_KEY': 'yy.sid',
    'COOKIE_MAXAGE': 900000,
    'COOKIE_SECRET': 'cac9904545bae07cb09bad9dab7f3ced',
    'REDIS_HOST': 'localhost',
    'REDIS_PORT': 6379,
    'RETHINKDB': 'localhost:3000',
});

/*
 * Setup environment
 */
app.set('port', nconf.get('PORT'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/*
 * Setup middlewares
 */
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// Setup session
app.use(express.cookieParser(nconf.get('COOKIE_SECRET')));
var store;
if (env == 'test' || env == 'coverage') {
    var MemoryStore = express.session.MemoryStore;
    store = new MemoryStore();
} else {
    var RedisStore = require('connect-redis')(express);
    // The line below will generates error message
    var redis = require('redis').createClient();
    var options = {
        host: nconf.get('REDIS_HOST'),
        port: nconf.get('REDIS_PORT'),
        maxAge: nconf.get('COOKIE_MAXAGE')
    };
    store = new RedisStore(options);
}
app.use(express.session({
    secret: nconf.get('COOKIE_SECRET'),
    key: nconf.get('COOKIE_KEY'),
    store: store,
    cookie: {
        maxAge: nconf.get('COOKIE_MAXAGE')
    }
}));

// Authentication middleware
// TODO

// csrf()
// app.use(require('express').csrf());
// app.use(function(req, res, next) {
//     res.locals.token = req.csrfToken();
//     next();
// });

// Router
app.use(app.router);

// Static file server
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes.route(app);
// app.get('/', routes.route);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});*/