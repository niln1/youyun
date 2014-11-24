/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Q = require('q');
var _ = require('underscore');
var Schema = mongoose.Schema;

var StudentParentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

/**
 * [findChildrenByParent return array]
 * @param  {[id]} parentid
 * @return {[]}        [description]
 */
StudentParentSchema.statics.findChildrenByParent = function (parent) {
    var defer = Q.defer();

    this.find({
        parent: parent._id.toString()
    }, function (err, studentParentPairs) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(_.pluck(studentParentPairs, 'student'));
        }
    });

    return defer.promise;
};

module.exports = mongoose.model('StudentParent', StudentParentSchema);