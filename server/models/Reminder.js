/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReminderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    reminderMessage: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        default: Date.now,
        required: true
    },
    flag: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Reminder', ReminderSchema);