/*
 * file: apiServererate.js
 * CapiServeryright(c) 2013, Cyan Inc. All rights reserved.
 */
'use strict';

var __ = require('underscore');
var util = require('util');
var nconf = require('nconf');
var https = require('http');
var urlparse = require('url');
var crypto = require('crypto');
var apiServer = {};

apiServer.sendResponse = function(response, req, res) {
    res.writeHead(response.statusCode, {
        'Content-Type': 'application/json'
    });
    response.on('data', function(data) {
        res.write(data);
    });
    response.on('end', function(data) {
        res.end(data);
    });
}; // sendResponse //

apiServer.sendError = function(error, req, res) {
    res.json(500, {
        result: false,
        message: 'Internal Server Error',
        description: 'Unable to get data at this point of time.',
        source: 'youyun'
    });
}; // sendError //

apiServer.userNotAuthenticated = function(req, res, e) {
    res.json(401, {
        result: 'false',
        message: !e ? 'User not authenticated' : e,
        description: 'Invalid Cookie. Please login',
        source: 'youyun'
    });
}; // userNotAuthenticated //

apiServer.missingQueryParameters = function(req, res, err) {
    res.json(400, {
        result: false,
        message: 'Missing Query Parameters',
        description: err,
        source: 'youyun'
    });
}; // missingQueryParameters //

apiServer.getSignature = function(url, privateKey) {
    var urlObject = urlparse.parse(url, true);
    var path = urlObject.pathname;
    var querystring = urlObject.search;

    console.log("urlObject: " + JSON.stringify(urlObject));

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

apiServer.verifySignature = function(req, path, method, version) {

    var userId = req.session.user.user_id;
    var apiKey = "tempkey";
    var user_signature = req.body.s;

    console.log("path: " + path);
    console.log("user_signature: " + path);

    var url = baseUrl + queryString;
    var signature = apiServer.getSignature(url, apiKey);
    return true
}; //verifySignature//

apiServer.get = function(req, res, path, method, version, success, failure) {
    success = typeof success !== 'undefined' ? success : apiServer.sendResponse;
    failure = typeof failure !== 'undefined' ? failure : apiServer.sendError;
    var url = apiServer.constructUrl(req, path, method, version);
    https.get(url, function(response) {
        return success(response, req, res);
    }).on('error', function(err) {
        return failure(err, req, res);
    });
}; // get //

module.exports = apiServer;