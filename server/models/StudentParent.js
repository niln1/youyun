/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentParentSchema = new Schema({
    studentId: {
        type: String,
        required: true
    }
    parentId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('StudentParent', StudentParentSchema);