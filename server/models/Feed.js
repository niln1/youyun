/*
 * Copyright (c) 2014, Zhihao Ni. All rights reserved.
 */

'use strict';

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
feedSchema.methods.findByUser = function (userId, isRead) {
    var defer = Q.defer();
    logger.db('feedSchema -- findByUser');

    this.find({}).exec(function(err, feeds) {
        if (err) defer.reject(err);
        else {
            defer.resolve(feeds);
        }
    });

    return defer.promise;
};

/**
 * Add Feed with option // no defer
 */
feedSchema.statics.addFeed = function (option) {
    var option = option || {};
    option.timeStamp = new Date();


}

module.exports = mongoose.model('Feed', feedSchema);