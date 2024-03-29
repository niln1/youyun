/*
 * file: socket-routes.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var fs = require('fs');
var nconf = require('nconf');
var async = require('async');

exports.route = function (io, sessionStore, cookieParser) {
    var env = nconf.get('env');
    if (env == 'test' || env == 'coverage') {
        // Defaults to MemoryStore
    } else {
        var RedisStore = require('socket.io/lib/stores/redis');
        var redis = require('socket.io/node_modules/redis');

        if (process.env.REDIS_URL) {
            var rtg   = require("url").parse(process.env.REDIS_URL);
            var pub = redis.createClient(rtg.port, rtg.hostname);
            var sub = redis.createClient(rtg.port, rtg.hostname);
            var client = redis.createClient(rtg.port, rtg.hostname);
        } else {
            var pub = redis.createClient();
            var sub = redis.createClient();
            var client = redis.createClient();
        }

        io.set('store', new RedisStore({
            redisPub: pub,
            redisSub: sub,
            redisClient: client
        }));
    }

    if (env === 'development') {
        io.set('log level', 2);
    } else {
        io.set('log level', 0);
    }

    io.set('browser client', false);

    /*
     * Authentication
     */
    io.set('authorization', function (handshakeData, accept) {
        cookieParser(handshakeData, {}, function(err) {
            if (err) {
                accept(err, false);
            } else {
                var sessionCookie = handshakeData.signedCookies[nconf.get('cookie-key')];
                sessionStore.get(sessionCookie, function(err, session) {
                    if (err || !session || !session.user) {
                        accept(err, false);
                    } else {
                        handshakeData.session = session;
                        accept(null, true);
                    }
                });
            }
        });
    });

    /*
     * Routes and settings defined in core module
     */
    io.on('connection', function (socket) {

        // Make sure socket is valid
        if (!socket.manager.handshaken[socket.id].session) {
            socket.destroy();
            return;
        }

        socket.session = socket.manager.handshaken[socket.id].session;

        // Define core socket events HERE

        // Load socket events from submodules
        loadModules(socket);
    });

    /*
     * Routes and settings defined in submodules
     */
    function loadModules(socket) {
        var cwd = process.cwd();
        var modulesDir = __dirname + '/modules';

        async.waterfall([
            function (callback) {
                // Read all of the files in '/app/src/modules', the submodules folder
                return fs.readdir(modulesDir, function (err, files) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, files);
                    }
                });
            }, function (files) {
                // For each module, load the module
                // if 'socket_routes.js' is found in the folder

                files.forEach(function (file) {
                    readModule(file, socket);
                });
            }
        ]);
    }

    /*
     * Helper method to load module
     */
    function readModule (file, socket) {
        // Get absolute path of submodule file
        var cwd = process.cwd();
        var modulesDir = __dirname + '/modules';
        var moduleDir = modulesDir + '/' + file;

        return async.waterfall([
            function (callback) {
                // Detect if the file is a directory
                // (a module is a directory in '/app/src/modules' folder)
                return fs.lstat(moduleDir, function (err, stats) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, stats.isDirectory());
                });
            }, function (isDir, callback) {
                // Read 'routes.js' if it's found in the module
                var routesFile;
                if (!isDir) {
                    return callback();
                }

                routesFile = moduleDir + '/socket-routes.js';
                return fs.exists(routesFile, function (exists) {
                    if (!exists) {
                        return callback();
                    }

                    require(routesFile).route(socket);

                    return callback();
                });
            }
        ]);
    }
}