/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentPickupDetailSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pickedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    mondayPickupTime: {
        type: String
    },
    tuesdayPickupTime: {
        type: String
    },
    wednesdayPickupTime: {
        type: String
    },
    thursdayPickupTime: {
        type: String
    },
    fridayPickupTime: {
        type: String
    },
    saturdayPickupTime: {
        type: String
    },
    sundayPickupTime: {
        type: String
    },
});
module.exports = mongoose.model('StudentPickupDetail', StudentPickupDetailSchema);