/* Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
*/

//Vendor modules and variables
var express = require('express');
var nconf = require('nconf');
var http = require('http');
var path = require('path');
var passport = require('passport');
var local = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var app;
module.exports.app = app = express();


// Local modules and variables
var routes = require('./app/routes');
var env = app.get('env');
var db = require('./app/modules/rethinkdb/db');

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
     app.use(express.favicon());
     app.use(express.logger('dev'));
     app.use(express.json());
     app.use(express.urlencoded());
     app.use(express.methodOverride());
     app.use(passport.initialize());
     app.use(passport.session());
     app.use(flash());

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

    db.setup();

});


// Authentication middleware
// TODO

passport.use(new local(
  function(username, password, next) {
    // asynchronous verification
    process.nextTick(function () {
      var validateUser = function (err, user) {
        console.log("[validating user]"+JSON.stringify(user));
        if (err) { return next(err); }
        if (!user) { return next(null, false, {message: 'Unknown user: ' + username})}

            //@todo use bcrypt//bcrypt.compareSync(password, user.password)
            if (password===user.password) {
                console.log('Success');
                return next(null, user);
            }
            else {
                console.log('Invalid username or password');
                return next(null, false, {message: 'Invalid username or password'});
            }
        };

        db.findUserByUname(username, validateUser);
    });
}
));

passport.serializeUser(function(user, next) {
  console.log("[DEBUG][passport][serializeUser] %j", user);
  next(null, user.id);
});

passport.deserializeUser(function (id, next) {
  db.findUserById(id, next);
});


// TODO: put this in routes.. too lazy
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    console.log("Success!");
}
);

app.get('/login', function (req, res) {
  if (typeof req.user !== 'undefined') {
    // User is logged in.
    res.redirect('/chat');
  }
  else {
    req.user = false;
  }
  var message = req.flash('error');
  if (message.length < 1) {
    message = false;
  }
  res.render('login', { title: 'Login', message: message, user: req.user });
});

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
});