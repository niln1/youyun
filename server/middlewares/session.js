var nconf = require('nconf');
var express = require('express');

module.exports = function(app) {
    var env = app.get('env');

    // Setup session
    app.use(express.cookieParser(nconf.get('cookie-secret')));
    var store;
    if (env == 'test' || env == 'coverage') {
        var MemoryStore = express.session.MemoryStore;
        store = new MemoryStore();
    } else {
        var RedisStore = require('connect-redis')(express);
        // The line below will generates error message
        var redis = require('redis').createClient();
        var options = {
            host: nconf.get('redis-host'),
            port: nconf.get('redis-port'),
            maxAge: nconf.get('cookie-maxage')
        };
        store = new RedisStore(options);
    }
    app.use(express.session({
        secret: nconf.get('cookie-secret'),
        key: nconf.get('cookie-key'),
        store: store,
        cookie: {
            secure: false,
            maxAge: nconf.get('cookie-maxage')
        }
    }));
}