/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var StudentParent = require('./StudentParent');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var __ = require('underscore');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    lastname: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: false
    },
    userType: {
        type: Number, // 0 - admin 1 - schoolhead 2 - teacher 3 - student 4 - parent 5 - alumini
        required: true
    },
    classes: [{
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }],
    devices: [{
        type: Schema.Types.ObjectId,
        ref: 'Device'
    }],
    // only for student
    pickupLocation: {
        type: String,
        required: false,
    }
    // need a json to store enterdate and graduate date
});

UserSchema.pre('save', function (next) {
    var user = this;

    // generate image Path
    user.userImage = "/static/img/default_image/default-user.png";

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.hasChild = function (childId, defer) {
    if (this.userType === 4) {
        StudentParent.find({parent: this._id},
            function (err, data) {
                if (err) throw err;
                var studentIds = __.pluck(data, "student");
                console.log(studentIds);
                var isMyChild = __.reduce(studentIds, function(memo, id){ 
                    if (id.equals(childId)) return memo + 1;
                    else return memo + 0; 
                }, 0);
                if (studentIds.length === 0) defer.reject(new Error("U have no child"));
                else if (isMyChild === 1) defer.resolve();
                else defer.reject(new Error("That child is not yours"));
        })
    } else {
        defer.reject(new Error("U cannot have child if not parent"));
    }
};

UserSchema.statics.findByOptions = function (options, cb) {
    var query = {};
    if (options.userType) query.userType = options.userType;
    if (options.isPickUp) query.pickupLocation = {
        '$exists': Boolean(JSON.parse(options.isPickUp))
    };
    this.find(query, cb);
};

UserSchema.statics.isParent = function(user) {
    return user.userType === 4;
};

module.exports = mongoose.model('User', UserSchema);