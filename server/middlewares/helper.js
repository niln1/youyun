var logger = require('../utils/logger');
var nconf = require('nconf');

var helper = {};

helper.logErrors = function(err, req, res, next) {
    logger.error(err.stack);
    next(err);
}

helper.clientErrorHandler = function(err, req, res, next) {
    if (req.xhr) {
        res.send(500, {
            error: 'Server Error'
        });
    } else {
        next(err);
    }
}

helper.errorHandler = function(err, req, res, next) {
    res.status(500);
    res.render('500', {
        error: err
    });
}

helper.loadEnvironment = function(req, res, next) {
    // res.locals.token = req.csrfToken();
    var env = nconf.get('env');
    res.locals.env = env;
    next();
}

module.exports = helper;