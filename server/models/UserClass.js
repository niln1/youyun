/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserClassSchema = new Schema({
    userId: {
        type: String,
        required: true
    }
    classId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserClass', UserClassSchema);