/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
    }]
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

module.exports = mongoose.model('User', UserSchema);