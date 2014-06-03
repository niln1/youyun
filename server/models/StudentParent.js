/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentParentSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('StudentParent', StudentParentSchema);