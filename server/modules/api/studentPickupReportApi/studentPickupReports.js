/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var User = require('../../../models/User');
var StudentPickupReport = require('../../../models/StudentPickupReport');
var mongoose = require('mongoose');

var apiServer = require('../utils/apiServer');
var logger = require('../../../utils/logger');
var __ = require('underscore');
var Q = require('q');

exports.init = function (req, res) {}

exports.read = function (req, res) {}

exports.readCurrent = function (req, res) {}

exports.addAbsence = function (req, res) {}