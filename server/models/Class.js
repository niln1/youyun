/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = new Schema({
    className: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Class', ClassSchema);