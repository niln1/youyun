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

StudentPickupReportSchema.statics.findByLock = function (lock, cb) {
    this.find({lock: lock}).exec(cb);
}

module.exports = mongoose.model('StudentPickupReport', StudentPickupReportSchema);