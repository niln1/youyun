/*
 * Copyright (c) 2014, Tracy H. All rights reserved.
 */
 'use strict';

 var User = require('../../../models/User');
 var apiServer = require('../utils/apiServer');
 var logger = require('../../../utils/logger');


 var __ = require('underscore');
 var Q = require('q');

exports.createUser = function (req, res) {

    return apiServer.apiCallHelper(req, res, {
        infoMessage: "admin create new user",
        userValidationHandler: function(user, signatureIsValid) {
            // find if student id exist
            if (user.isAdmin()) {
                return true;
            } else {
                throw new Error("U dont have Permission Dude");
            }
        },
        processHandler: function() {
            var defer = Q.defer();

            var data = JSON.parse(JSON.stringify(req.body)); // create a simple clone just for the data

            delete data.signature;
            
            logger.debug("Param: " + JSON.stringify(data));

            var userTypeString = User.getUserTypeString(data.userType);
            userTypeString = userTypeString.substring(0, 3);
            logger.debug(userTypeString);
            generateUsernameByFnLn(data.firstname, data.lastname, userTypeString, 1).then(function(username) {
                data.username = username;
                data.password = data.username + 'pw';
                logger.debug(data);
                var newUser = new User(data);
                newUser.save(function (err, user) {
                    if (!err && user) {
                        user = castOutPassword(user);
                        defer.resolve(user);
                    } else {
                        defer.reject(err);
                    }
                });

            });

            return defer.promise;

        },

        successHandler: function(user) {
            logger.info("Admin -- User Created");
            apiServer.sendResponse(req, res, user, 'New user successfully Created');
        }

    });

}

function castOutPassword (user) {
    user.password = "Black Sheep Wall";
    return user;
}

function generateUsernameByFnLn( firstname, lastname, token, hit ) {
    var self = this;
    var string1 = firstname.replace(/\s+/g, '').replace(",", ".");
    var string2 = lastname.replace(/\s+/g, '').replace(",", ".");

    string1 = (string1.length > 3) ? string1.substring(0,3) : string1;
    string2 = (string2.length > 3) ? string2.substring(0,3) : string2;

    var testUsername = token.toLowerCase() + string1.toLowerCase() + string2.toLowerCase() + hit;

    var deferred = Q.defer();

    User.find({"username":testUsername}, function(err, users){
        if (err) deferred.reject(err);
        if ( users.length === 0 ) {
            deferred.resolve(testUsername);
        } else {
            console.log("++++++++++USERNAME EXIST+++++++++");
            deferred.resolve(generateUsernameByFnLn(firstname, lastname, token, hit+1));
        }
    });

    return deferred.promise;
}