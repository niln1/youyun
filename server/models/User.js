/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

'use strict';

var StudentParent = require('./StudentParent');
var Device = require('./Device');
var mongoose = require('mongoose');
var Q = require('q');

var Schema = mongoose.Schema;

var logger = require('../utils/logger.js');
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
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        // get: passwordGetter
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
    },
    pickupStudentGrade: {
        type: String,
        required: false,
    },
    pickupStudentRoomNumber: {
        type: String,
        required: false,
    },
    studentPickupDetail: {
        type: Schema.Types.ObjectId,
        ref: 'studentPickupDetail',
        required: false,
    }
    // need a json to store enterdate and graduate date
});

function passwordGetter() {
    return 'Black Sheep Wall';
};

UserSchema.virtual('fullname').get(function () {
    return this.firstname + ' ' + this.lastname;
});

UserSchema.set('toObject', { getters: true, virtuals: true });

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
        bcrypt.hash(user.toJSON().password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

});

/**
 * Compare if the candidate password hash is the same as the one in collection
 */
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.toJSON().password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

/**
 * TODO: NEED REVIEW
 * [Depreciated] Check If User has The Child
 * @param  {id}  childId
 * @param  {Q.defer}  defer
 * @return {Boolean}  return true if has that child, and vice versa
 */
UserSchema.methods.hasChild = function (childId, defer) {
    if (this.userType === 4) {
        StudentParent.find({
                parent: this._id
            },
            function (err, data) {
                if (err) defer.reject(err);
                var studentIds = __.pluck(data, "student");
                var isMyChild = __.reduce(studentIds, function (memo, id) {
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

UserSchema.methods.getParents = function () {
    var defer = Q.defer();

    logger.db('UserSchema -- getParents');
    if (this.userType === 3) {
        StudentParent.find({
            student: this._id
        })
            .populate('parent')
            .exec(function (err, data) {
                if (err) defer.reject(err);
                Device.populate(data, {
                    path: 'parent.devices',
                    model: 'Device'
                }, function (err, things) {
                    var parents = __.pluck(data, "parent");
                    defer.resolve(parents);
                });
            });
    } else {
        defer.reject(new Error("U cannot have parent if not student"));
    }

    return defer.promise;
};

UserSchema.methods.addDevice = function (device) {
    var defer = Q.defer();

    logger.db('UserSchema -- addDevice');
    this.devices.addToSet(device._id);
    this.save(function (err, user) {
        if (err) defer.reject(err);
        else defer.resolve(user);
    });
    return defer.promise;
}

UserSchema.statics.findByOptions = function (options, cb) {
    var query = {};
    if (options.userType) query.userType = options.userType;
    if (options.isPickUp) query.pickupLocation = {
        '$exists': Boolean(JSON.parse(options.isPickUp))
    };
    this.find(query, cb);
};

UserSchema.methods.isAdmin = function () {
    return this.userType === 0;
};

UserSchema.methods.isSchool = function () {
    return this.userType === 1;
};

UserSchema.methods.isTeacher = function () {
    return this.userType === 2;
};

UserSchema.methods.isStudent = function () {
    return this.userType === 3;
};

UserSchema.methods.isParent = function () {
    return this.userType === 4;
};

UserSchema.methods.isAlumini = function () {
    return this.userType === 5;
};

module.exports = mongoose.model('User', UserSchema);