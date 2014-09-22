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

/* Apple push notification */
var apn = require('apn');
var apnOptions = {};
var apnConnection = new apn.Connection(apnOptions);

var apiServer = {};

apiServer.sendPushNotification = function (deviceType, token, message, options) {
    if (deviceType == 0) {
        logger.info('Pushing to an iOS device with message "' + message + '" and token "' + token + '".');

        var device = new apn.Device(token);
        var note = new apn.Notification();

        note.expiry = options.expiry || Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = options.badge || 3;
        note.sound = options.sound || "ping.aiff";
        note.alert = message || '';
        note.payload = options.payload || {};

        apnConnection.pushNotification(note, device);

    } else if (deviceType == 1) {
        logger.info('Pushing to an Android device with message "' + deviceType + '" and token "' + token + '".');
    } else {
        logger.warn('Trying to push to an unknown device with type "' + deviceType + '" and token "' + token + '".');
    }
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

    if (resp.password) {
        logger.trace("Casting out password");
        resp.password = "Black Sheep Wall";
    };

    res.json(200, {
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