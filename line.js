/*
 * file: line.js multithread simulation
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
"use strict";

var i, _i;

var cluster = require('cluster');
var colors = require('colors');
var dot = require('./dot');

var instances = {};

var numCPUs = require('os').cpus().length;

var spawn = function() {
    var instance = cluster.fork();
    instances[instance.pid] = instance;
    return instance;
};

if (cluster.isMaster) {
    var nodeEnv = process.env.NODE_ENV;
    var isProd = (nodeEnv === 'production') || (nodeEnv === 'nginx');

    if (isProd) {
        console.log('Please make sure you have configured and started database server.'.yellow)
    }

    console.log('Cluster ' + process.pid + ' spawning instances' +
        (isProd ? ' in production mode' : ' in development mode'));

    for (i = _i = 0; 0 <= numCPUs ? _i <= numCPUs : _i >= numCPUs; i = 0 <= numCPUs ? ++_i : --_i) {
        spawn();
    }

    cluster.on('death', function(instance) {
        console.log('Instance ' + instance.pid + ' died. Spawning a new process.');
        delete instances[instance.pid];
        return spawn();
    });
} else {

    instance.startServer();
}