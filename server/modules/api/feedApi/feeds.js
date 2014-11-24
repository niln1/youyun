/*
* Copyright (c) 2014, Zhihao Ni. All rights reserved.
*/
'use strict';

var User = require('../../../models/User');
var Feed = require('../../../models/Feed');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');

var __ = require('underscore');
var Q = require('q');

exports.read = function (req, res) {
    return apiServer.apiCallHelper(req, res, {
        infoMessage: "Feeds -- Read",
        userValidationHandler: function(user, signatureIsValid) {
            if (user) {
                return true;
            } else {
                throw new Error("User not valid dude");
            }
        },
        processHandler: function() {
            return Feed.findByUser(req.query.userId, req.query.pageNumber);
        },
        successHandler: function(feeds) {
            logger.info("Feeds -- Read Success");
            apiServer.sendResponse(req, res, feeds, 'Feeds info successfully retrieved');
        }
    });
};