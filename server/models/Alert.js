/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlertSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    alertMessage: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        default: Date.now,
        required: true
    },
    flag: {
        type: Boolean
        default: false
    }
});
module.exports = mongoose.model('Alert', AlertSchema);