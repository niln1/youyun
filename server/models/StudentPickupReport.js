/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

StudentPickupReportSchema.statics.findByLock = function (lock, cb) {
    this.find({lock: lock}).exec(cb);
}

StudentPickupReportSchema.statics.findMonthByDate = function (date, cb) {
    var start = moment(date).tz('UTC').startOf('month').format();
    var end = moment(date).tz('UTC').endOf('month').format();
    console.log(start, end);
    this.find({date: {$gte: start, $lt: end}}).exec(cb);
}

module.exports = mongoose.model('StudentPickupReport', StudentPickupReportSchema);