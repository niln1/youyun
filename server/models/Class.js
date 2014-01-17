/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = new Schema({
    classname: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Message', MessageSchema);