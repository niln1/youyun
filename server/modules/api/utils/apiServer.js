/*
 * file: apiServer.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var Q = require('q');
var __ = require('underscore');
var util = require('util');
var nconf = require('nconf');
var https = require('http');
var urlparse = require('url');
var crypto = require('crypto');
var logger = require('../../../utils/logger');
var User = require('../../../models/User');

var apiServer = {};

/**
 * General Api call Wrapper to reduce redendent code
 * @param  {object} req needed
 * @param  {object} res needed
 * @param  {object} opt needed
 */
 apiServer.apiCallHelper = function (req, res, opt) {

    var opt = opt || {};

    // check options
    if (!opt.infoMessage) {
        logger.warn("Missing infoMessage");
        return;
    } else if (!opt.userValidationHandler) {
        logger.warn("Missing userValidationHandler");
        return;
    } else if (!opt.processHandler) {
        logger.warn("Missing processHandler");
        return;
    } else if (!opt.successHandler) {
        logger.warn("Missing successHandler");
        return;
    }

    // start helper
    logger.info(opt.infoMessage);
    Q.all([
        this.validateUserSession(req, res),
        this.validateSignature(req, res)
        ])
    .spread(function (user, signatureIsValid) {
        return opt.userValidationHandler(user, signatureIsValid);
    })
    .then(function(hasPermission){
        return opt.processHandler(hasPermission);
    })
    .then(function(data){
        return opt.successHandler(data);
    })
    .fail(function(err){
        if (opt.errorHandler) {
            return opt.errorHandler(err);
        } else {
            logger.warn(err);
            this.sendBadRequest(req, res, err.toString());
        }
    });
}

apiServer.invalidContentType = function(res, desc) {
    logger.warn("API - invalid Content-Type: " + desc);
    res.json(400, {
        'result': false,
        'message': 'Invalid Content-Type',
        'description': desc,
        'source': nconf.get('server-name')
    });
}

apiServer.invalidQueryParameters = function(res, desc) {
    logger.warn("API - invalid required query parameters: " + desc);
    res.json(400, {
        'result': false,
        'message': 'Invalid Query Parameters specified',
        'description': desc,
        'source': nconf.get('server-name')
    });
}

apiServer.missingRequiredQueryParameters = function(res, desc) {
    logger.warn("API - missing required query parameters: " + desc);
    res.json(400, {
        'result': false,
        'message': 'Required Query Parameters missing',
        'description': desc,
        'source': nconf.get('server-name')
    });
}

apiServer.apiNotDefined = function(req, res, e) {
    logger.warn("API - api not defined: " + e);
    res.json(401, {
        'result': false,
        'message': !e ? 'API requested is not defined' : e,
        'description': req.url + ' is not defined',
        'source': nconf.get('server-name')
    });
}

apiServer.serveApiSpec = function(res) {
    logger.info("API - serving api spec");
    var apiSpec = require('./apiSpec');
    res.json(200, apiSpec);
}

apiServer.sendResponse = function(req, res, resp, desc) {
    logger.info("API - sendResponse: " + desc);
    
    function castPassword(object) {
        // lean the mongoose doc
        if (object.toObject) object = object.toObject(); 
        if (__.isObject(object)) {
            if (object.password) {
                object.password = "Black Sheep Wall";
            };
            __.each(object, function(element){
                castPassword(element);
            });
        }
        return;
    }

    if (resp) {
        castPassword(resp);
    };

    res.status(200).json({
        result: resp,
        description: desc,
        source: nconf.get('server-name')
    });
}; // sendResponse //

apiServer.sendError = function(req, res, e) {
    logger.fatal("API - Internal Server Error: " + e);

    res.json(500, {
        result: false,
        message: 'Internal Server Error',
        description: !e ? 'Unable to get data at this point of time.' : e,
        source: nconf.get('server-name')
    });
}; // sendError //

apiServer.sendBadRequest = function(req, res, e) {
    logger.warn("API - Bad Request: " + e);

    res.json(400, {
        result: false,
        message: 'Bad Request',
        description: !e ? 'Unable to get data at this point of time.' : e,
        source: nconf.get('server-name')
    });
}

apiServer.userNotAuthenticated = function(req, res, e) {
    logger.warn("API - userNotAuthenticated: " + e);

    res.json(401, {
        result: false,
        message: !e ? 'User not authenticated' : e,
        description: 'Invalid Cookie. Please login',
        source: nconf.get('server-name')
    });
}; // userNotAuthenticated //

apiServer.invalidUserSignature = function(req, res) {
    logger.warn("API - invalidUserSignature");

    res.json(401, {
        result: false,
        message: 'Signature Incorrect',
        description: 'Plz stop hacking me or I will call the police',
        source: nconf.get('server-name')
    });
}; // userNotAuthenticated //

apiServer.missingQueryParameters = function(req, res, err) {
    logger.warn("API - missingQueryParameters: " + err);

    res.json(400, {
        result: false,
        message: 'Missing Query Parameters',
        description: err,
        source: nconf.get('server-name')
    });
}; // missingQueryParameters //

apiServer.getSignature = function(url, privateKey) {
    var urlObject = urlparse.parse(url, true);
    var path = urlObject.pathname;
    var querystring = urlObject.search;

    // only the url path and query is needed to generate the signature
    var urlToSign = path + querystring;

    // Decode the private apiKey into its binary format
    var decodedKey = new Buffer(privateKey, 'base64');

    // Create an hmac key using the sha1 algorithm and the private key
    var hmacKey = crypto.createHmac('sha1', decodedKey);

    // add the urlToSign to the hmacKey
    hmacKey.update(urlToSign, 'binary');

    // create a base64 digest
    var digest = hmacKey.digest('base64');

    var urlSafeSign = digest.replace(/\+/g, '-').replace(/\//g, '_');
    return urlSafeSign;
}; // getSignature //

apiServer.verifySignature = function(req, res, next) {
    var userId = req.session.user._id;
    var apiKey = "tempkey";
    var user_signature = req.query.signature;
    if (!user_signature && req.body && req.body.signature)
        user_signature = req.body.signature;

    if (user_signature == apiKey) {
        next(req, res);
    } else {
        apiServer.invalidUserSignature(req, res);
    }
}; //verifySignature//

apiServer.validateSignature = function(req, res) {
    var deferred = Q.defer();
    var apiKey = "tempkey";
    var user_signature = req.query.signature || req.body.signature;

    if (user_signature == apiKey) deferred.resolve(true);
    else deferred.reject(new Error('Request signature invalid.'));

    return deferred.promise;
} //validateSignature//

apiServer.validateUserSession = function(req, res) {
    var deferred = Q.defer();

    if (req.session.user) {
        User.findOne({username: req.session.user.username}, function (err, user) {
            if (err) deferred.reject(err);
            else if (!user) deferred.reject(new Error('User session invalid.'));
            else deferred.resolve(user);
        });
    }
    else deferred.reject(new Error('User session invalid.'));

    return deferred.promise;
} //validateUserSession//

//TODO
function getStartOfTheDay() {
    return 1
}

module.exports = apiServer;