
'use strict';

var Q = require('q');
var User = require('../models/User');
var socketServer = {};

socketServer.validateUserSession = function (socket) {
    var deferred = Q.defer();

    if (socket.session.user) {
        User.findOne({username: socket.session.user.username}, function (err, user) {
            if (err) deferred.reject(err);
            else if (!user) deferred.reject(new Error('User session invalid.'));
            else deferred.resolve(user);
        });
    }
    else deferred.reject(new Error('User session invalid.'));

    return deferred.promise;
};

module.exports = socketServer;