/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */

'use strict';

var Q = require('q');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
    },
    type: {
        type: String,
        required: true,
        default: "school" // this determine the icon before feed
    },
    infoType: {
        type: String,
        required: true,
        default: "info" // this change the icon color
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },
    timeStamp: {
        type: Date,
        required: true
    }
});

/**
 * Find feed by user and is read tag
 * @param  {ObjectId}  userId
 * @param  {Boolean} isRead
 */
feedSchema.statics.findByUser = function (userId, page) {
    var defer = Q.defer();
    var perPage = 10;
    var page = page > 0 ? page : 0;
    logger.db('feedSchema -- findByUser -- page:' + page);
    this.find({
        user: userId
    })
    .sort({timeStamp: -1}) // decending sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, feeds) {
        if (err) defer.reject(err);
        else {
            defer.resolve(feeds);
        }
    });

    return defer.promise;
};

module.exports = mongoose.model('Feed', feedSchema);