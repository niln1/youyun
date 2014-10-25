/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Q = require('q');
var Schema = mongoose.Schema;

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
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    date: {
        type: Date,
        required: true
    }
});

StudentPickupReportSchema.methods.addAbsence = function (studentId, defer) {
    this.absenceList.addToSet(studentId);
    this.save(function(err, report){
        if (err) defer.fail(err);
        else defer.resolve(report);
    });
}
StudentPickupReportSchema.methods.removeAbsence = function (studentId, defer) {
    this.absenceList.pull(studentId);
    this.save(defer.resolve());
}
StudentPickupReportSchema.methods.addPickedUp = function (studentId, defer) {
    this.pickedUpList.addToSet(studentId);
    this.save(defer.resolve());
}
StudentPickupReportSchema.methods.removePickedUp = function (studentId, defer) {
    this.pickedUpList.pull(studentId);
    this.save(defer.resolve());
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
    .populate('pickedUpList')
    .populate('absenceList')
    .exec(function (err, report) {
        if (err) defer.reject(err);
        else {
            StudentPickupDetail.populate(report.needToPickupList, { 
                path : 'studentPickupDetail',
                model: 'StudentPickupDetail'
            }, function(err, things){
                if ( err ) throw new err;
                defer.resolve(report);
            });
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