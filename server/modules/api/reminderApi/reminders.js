/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var Reminder = require('../../../models/Reminder');
var apiServer = require('../utils/apiServer');

exports.createReminder = function (req, res) {
	apiServer.verifySignature(req, res, createReminderWithMessage)
}

exports.readReminders = function (req, res) {
	apiServer.verifySignature(req, res, findRemindersByUserId)
}

//-----------------helpers--------------------//

function createReminderWithMessage (req, res) {
	var newReminder = new Reminder({
		userId: req.session.user._id,
		message: req.body.message
	})

	if (req.body.dueDate) {
		newReminder.dueDate = new Date(req.body.dueDate);
	}

	newReminder.save(function (err, reminder) {
		if (!err && reminder) {
			var dataToReturn = reminder;
			delete dataToReturn["_id"];
			apiServer.sendResponse(req, res, dataToReturn, 'Reminder created successfully')
		} else {
			apiServer.sendError(req, res, err);
		}
	})
}

function findRemindersByUserId (argument) {

}
