/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentWeeklyReportSchema = new Schema({
    userId: {
        type: String,
        required: true
    }
    week: {
        type: Number,
        default: getWeekNumber(Date.now),
        required: true,
        unique: true
    }
    data: {
        type: Number
    }
});


function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}

module.exports = mongoose.model('StudentWeeklyReport', StudentWeeklyReportSchema);

//todo get week of the year
//pre save/ find and update if the weeknumber is the same