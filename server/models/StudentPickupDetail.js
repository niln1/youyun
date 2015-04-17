/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */

'use strict';

var User = require('./User');

var logger = require('../utils/logger.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Q = require('q');

var StudentPickupDetailSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    pickedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mondayPickupTime: {
        type: String
    },
    tuesdayPickupTime: {
        type: String
    },
    wednesdayPickupTime: {
        type: String
    },
    thursdayPickupTime: {
        type: String
    },
    fridayPickupTime: {
        type: String
    },
    saturdayPickupTime: {
        type: String
    },
    sundayPickupTime: {
        type: String
    },
});

StudentPickupDetailSchema.post('save', function (detail) {
    logger.db("StudentPickupDetailSchema post save");
    User.findById(detail.student, function (err, user) {
        if(err) throw err;
        user.studentPickupDetail = detail._id;
        user.save(function (err, user) {
            if (err) throw err;
            logger.db("Detail added to the corresponding Student");
        });
    });
});

StudentPickupDetailSchema.statics.createWithData = function(data) {
    logger.db('Creating new StudentPickupDetail with data ' + data);
    var defer1 = Q.defer();
    this.create(data, function (err, detail) {
        if (err) {
            logger.fatal("ERROR:" + err);
            defer1.reject(err);
        }
        logger.db('Creating new StudentPickupDetail with data ' + data + ', success');
        defer1.resolve(detail);
    });

    return defer1.promise;
}

module.exports = mongoose.model('StudentPickupDetail', StudentPickupDetailSchema);