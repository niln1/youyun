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
        var MongoStore = require('connect-mongo')(express);
        var options = {
            url: nconf.get('mongodb-url') + '/' + nconf.get('mongodb-session-collection'),
            maxAge: nconf.get('cookie-maxage')
        };
        store = new MongoStore(options);
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