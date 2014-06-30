/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    this.save(defer.resolve());
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

module.exports = mongoose.model('StudentPickupReport', StudentPickupReportSchema);