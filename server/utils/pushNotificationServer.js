var Q = require('q');
var nconf = require('nconf');
var __ = require('underscore');
var logger = require('./logger');

var User = require('../models/User');

/* Apple push notification */
var apn = require('apn');
var apnOptions = {
    cert: __dirname + '/pushNotificationCerts/apns/HLYYDevCert.pem',
    key:  __dirname + '/pushNotificationCerts/apns/HLYYDevKey.pem',
    production: false,
    // "batchFeedback": true,
    // "interval": 300
};

var apnConnection = new apn.Connection(apnOptions);

var pushNotificationServer = {};

pushNotificationServer.notifyParent = function (studentId, message) {
    var defer = Q.defer();
    User.findById(studentId).exec(function(err, student){
        if (err) defer.reject(err);
        if (student) {
            student.getParents()
            .then(function(parents){
                __.each(parents, function(parent){
                    __.each(parent.devices, function(device){
                        pushNotificationServer.sendPushNotification(device.deviceType, device.token, message);
                    });
                });
                defer.resolve();
            });
        } else {
            defer.reject(new Error("Student Not Found"));
        }
    })
    return defer.promise;
}

pushNotificationServer.sendPushNotification = function (deviceType, token, message, options) {

    var options = options || {};

    if (deviceType === 0) {
        logger.info('Pushing to an iOS device with message "' + message + '" and token "' + token + '".');

        var device = new apn.Device(token);
        var note = new apn.Notification();

        note.expiry = options.expiry || Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = options.badge || 3;
        note.sound = options.sound || "ping.aiff";
        note.alert = message || '';
        note.payload = options.payload || {};

        apnConnection.pushNotification(note, device);

    } else if (deviceType === 1) {
        logger.info('Pushing to an Android device with message "' + deviceType + '" and token "' + token + '".');
    } else {
        logger.warn('Trying to push to an unknown device with type "' + deviceType + '" and token "' + token + '".');
    }
}


module.exports = pushNotificationServer;