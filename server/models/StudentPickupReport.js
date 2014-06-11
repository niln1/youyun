/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentPickupReportSchema = new Schema({
    needToPickup: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pickedUp: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    timeGenerated: {
        type: Date,
        require: true
    }
});

module.exports = mongoose.model('StudentPickupReport', StudentPickupReportSchema);