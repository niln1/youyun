/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var Reminder = require('../../../models/Reminder');
var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');

exports.createReminder = function(req, res) {
    apiServer.verifySignature(req, res, createReminderWithMessage)
}

exports.readReminders = function(req, res) {
    apiServer.verifySignature(req, res, findRemindersByUserId)
}

exports.updateReminderWithId = function(req, res) {
    apiServer.verifySignature(req, res, updateReminderById)
}

exports.deleteReminderWithId = function(req, res) {
    apiServer.verifySignature(req, res, deleteReminderById)
}

//-----------------helpers--------------------//

function createReminderWithMessage(req, res) {
    logger.info("Reminders - createReminderWithMessage");
    logger.debug("userId: " + JSON.stringify(req.session.user._id) + " message: " + req.body.message);
    var newReminder = new Reminder({
        userId: req.session.user._id,
        message: req.body.message
    })

    if (req.body.dueDate) {
        newReminder.dueDate = new Date(req.body.dueDate);
    }

    newReminder.save(function(err, reminder) {
        if (!err && reminder) {
            apiServer.sendResponse(req, res, reminder, 'Reminder created successfully')
        } else {
            apiServer.sendError(req, res, err);
        }
    })
}

function findRemindersByUserId(req, res) {
    logger.info("Reminders - findReminderByUserId");
    logger.debug("userId: " + JSON.stringify(req.session.user._id));
    Reminder.find({
        userId: req.session.user._id
    }, function(err, reminders) {
        if (!err && reminders) {
            apiServer.sendResponse(req, res, reminders, 'Reminder retrieved successfully')
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}

function updateReminderById(req, res) {
    logger.info("Reminders - updateReminderById");
    // cloning req.body
    var param = JSON.parse(JSON.stringify(req.body));
    delete param["signature"];
    logger.debug("params: " + JSON.stringify(params) + "id: " + JSON.stringify(req.params._id));

    Reminder.findOneAndUpdate({
        _id: req.params.id
    }, param, function(err, reminder) {
        if (!err && reminder) {
            apiServer.sendResponse(req, res, reminder, 'Reminder updated successfully')
        } else {
            apiServer.sendError(req, res, err);
        }
    });
}

function deleteReminderById(req, res) {
    logger.info("Reminders - deleteReminderById");
    logger.debug("id: " + JSON.stringify(req.params));

    Reminder.remove({
        _id: req.params.id
    }, function(err) {
        if (!err) {
            logger.info("Reminders - Reminder removed successfully");
            apiServer.sendResponse(req, res, reminder, 'Reminder removed successfully')
        } else {
            logger.warn("Reminders - Error: " + err);
            apiServer.sendError(req, res, err);
        }
    });
}