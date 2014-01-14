var nconf = require('nconf');
var express = require('express');

module.exports = function(app) {
    var env = app.get('env');

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
            secure: false,
            maxAge: nconf.get('COOKIE_MAXAGE')
        }
    }));
}