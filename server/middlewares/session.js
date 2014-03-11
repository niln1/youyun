var nconf = require('nconf');
var express = require('express');

module.exports = function(app) {
    var env = app.get('env');

    // Setup session
	var cookieParser = express.cookieParser(nconf.get('cookie-secret'));
    app.use(cookieParser);

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

	// These session setting will be used by socket.io module
	app.set('session-store', store);
	app.set('cookie-parser', cookieParser);

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