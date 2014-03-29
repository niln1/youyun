/*
 * file: apiServer.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var __ = require('underscore');
var util = require('util');
var nconf = require('nconf');
var https = require('http');
var urlparse = require('url');
var crypto = require('crypto');
var apiServer = {};

apiServer.sendResponse = function(req, res, resp, desc) {
    res.json(200, {
        result: resp,
        description: desc,
        source: nconf.get('server-name')
    });
}; // sendResponse //

apiServer.sendError = function(req, res, e) {
    res.json(500, {
        result: false,
        message: 'Internal Server Error',
        description: !e ? 'Unable to get data at this point of time.' : e,
        source: nconf.get('server-name')
    });
}; // sendError //

apiServer.userNotAuthenticated = function(req, res, e) {
    res.json(401, {
        result: false,
        message: !e ? 'User not authenticated' : e,
        description: 'Invalid Cookie. Please login',
        source: nconf.get('server-name')
    });
}; // userNotAuthenticated //

apiServer.invalidUserSignature = function(req, res) {
    res.json(401, {
        result: false,
        message: 'Signature Incorrect',
        description: 'Plz stop hacking me or I will call the police',
        source: nconf.get('server-name')
    });
}; // userNotAuthenticated //

apiServer.missingQueryParameters = function(req, res, err) {
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

//TODO
function getStartOfTheDay() {
    return 1
}

module.exports = apiServer;