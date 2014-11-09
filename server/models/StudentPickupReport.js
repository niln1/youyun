/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Q = require('q');
var Schema = mongoose.Schema;

var logger = require('../utils/logger.js');

var StudentPickupDetail = require('./StudentPickupDetail');

var moment = require('moment-timezone');

var StudentPickupReportSchema = new Schema({
    needToPickupList: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    absenceList: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pickedUpList: [{
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        pickedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        pickedUpTime: {
            type: Date,
        }
    }],
    date: {
        type: Date,
        required: true
    }
});

StudentPickupReportSchema.methods.pickUpStudent = function (studentId, pickedBy) {
    var defer = Q.defer();
    // should think about edge case?
    logger.db('StudentPickupReportSchema -- pickUpStudent');
    this.needToPickupList.pull(studentId);
    var pickedUpRecord = {
        student: studentId,
        pickedBy: pickedBy,
        pickedUpTime: new Date()
    };
    this.pickedUpList.push(pickedUpRecord);
    this.save(function (err, report) {
        if (err) defer.reject(err);
        else defer.resolve({ 
            report: report,
            record: pickedUpRecord
        });
    });
    return defer.promise;
}

StudentPickupReportSchema.methods.unpickPickedUp = function (studentId, unPickedBy) {
    var defer = Q.defer();
    logger.db('StudentPickupReportSchema -- unpickPickedUp');
    this.pickedUpList.pull({ student: studentId });
    this.needToPickupList.addToSet(studentId);
    this.save(function (err, report) {
        if (err) defer.reject(err);
        else defer.resolve({ 
            report: report,
            unPickedBy: unPickedBy,
            unPickedTime: new Date()
        });
    });
    return defer.promise;
}

StudentPickupReportSchema.statics.findMonthByDate = function (date, cb) {
    var start = moment(date).startOf('month').format();
    var end = moment(date).endOf('month').format();
    this.find({date: {$gte: start, $lt: end}}).exec(cb);
}

/**
 * helper function
 * @return {defer.promise}
 */
StudentPickupReportSchema.statics.findByOptions = function (options) {
    var defer = Q.defer();

    this.find(options, function (err, reports) {
        if (err) defer.reject(err);
        else defer.resolve(reports);
    })

    return defer.promise;
};

StudentPickupReportSchema.statics.findByID = function (reportID) {
    var defer = Q.defer();

    this.findOne({
        '_id': mongoose.Types.ObjectId(reportID.toString())
    }, function (err, report) {
        if (err) defer.reject(err);
        else defer.resolve(report);
    });

    return defer.promise;
};

StudentPickupReportSchema.statics.findAllReports = function () {
    return this.findByOptions({});
};

StudentPickupReportSchema.statics.findReportForToday = function () {
    var today = moment(new Date()).startOf('day').format("YYYY-MM-DD HH:mm:ss");
    var defer = Q.defer();

    this.findOne({
        "date" : today
    })
    .populate('needToPickupList')
    .populate('absenceList')
    .exec(function (err, report) {
        if (err) defer.reject(err);
        else if (report) {
            // Actually this is the only way to do this now: take a look later if supported
            StudentPickupDetail
            .populate(report.needToPickupList, { 
                path : 'studentPickupDetail',
                model: 'StudentPickupDetail'
            }, function(err, things){
                if ( err ) throw new err;

                StudentPickupDetail
                .populate(report.pickedUpList, { 
                    path : 'studentPickupDetail',
                    model: 'StudentPickupDetail'
                }, function(err, things){
                    if ( err ) throw new err;
                    defer.resolve(report);
                });
            });
        } else {
            defer.reject(new Error('No report For today'));
        }
    });

    return defer.promise;
};

StudentPickupReportSchema.statics.findReportsByUsers = function (users) {
    return this.findByOptions({
        $or : [
            {'needToPickupList': { '$in': users }},
            {'absenceList': { '$in': users }},
        ]
    });
};

module.exports = mongoose.model('StudentPickupReport', StudentPickupReportSchema);