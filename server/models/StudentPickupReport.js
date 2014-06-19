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
    lock: {
        type: Boolean,
        default: false
    }
});

StudentPickupReportSchema.methods.addAbsence = function (studentId) {
    this.absenceList.addToSet(studentId);
}
StudentPickupReportSchema.methods.removeAbsence = function (studentId) {
    this.absenceList.pull(studentId);
}
StudentPickupReportSchema.methods.addPickedUp = function (studentId) {
    this.pickedUpList.addToSet(studentId);
}
StudentPickupReportSchema.methods.removePickedUp = function (studentId) {
    this.pickedUpList.pull(studentId);
}

StudentPickupReportSchema.statics.findByLock = function (lock, cb) {
    this.find({lock: lock}).exec(cb);
}

module.exports = mongoose.model('StudentPickupReport', StudentPickupReportSchema);