/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReminderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date
    },
    isDone: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Reminder', ReminderSchema);