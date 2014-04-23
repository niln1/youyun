/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    deviceType: {
        type: Number, // 0: iOS, 1: Android
        required: true
    },
    deviceUUID:{
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    pushToken: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Device', DeviceSchema);