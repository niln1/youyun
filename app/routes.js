/*
 * file: routes.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var fs = require('fs');
var async = require('async');
var index = require('./index');
var passport = require('passport');
var local = require('passport-local').Strategy;

exports.route = function(app) {
    app.get('/', index.main);

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        function(req, res) {
            console.log("Successfully logged in!");
            res.redirect('/test');  
        });

    app.get('/login', function (req, res) {
        if (typeof req.user !== 'undefined') {
            res.redirect('/test');
        }
        else {
            req.user = false;
        }
        var message = req.flash('error');
        if (message.length < 1) {
            message = false;
        }
        res.render('login', { title: 'Login', message: message, user: req.user });
    });

    app.get('/logout', function(req, res){
        req.logout();
        console.log("Successfully logged out!");
        res.redirect('/login');
    });

    app.get('/test', function (req, res) {
        res.send('in test page');
    });


    /*
     * Helper method to load module
     */
    function readModule(file, callback) {
        // Get absolute path of submodule file
        var cwd = process.cwd();
        var modulesDir = cwd + '/app/modules';
        var moduleDir = modulesDir + '/' + file;

        async.waterfall([

            function(callback) {
                // Detect if the file is a directory
                // (a module is a directory in '/app/modules' folder)
                return fs.lstat(moduleDir, function(err, stats) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, stats.isDirectory());
                });
            },
            function(isDir, callback) {
                // Read 'routes.js' if it's found in the module
                var routesFile;
                if (!isDir) {
                    return callback();
                }

                routesFile = moduleDir + '/routes.js';
                fs.exists(routesFile, function(exists) {
                    if (!exists) {
                        return callback();
                    }
                    require(routesFile).route(app);
                    callback();
                });
            }
        ], function() {
            callback(null);
        });
    } // readModule //

    /*
     * Routes defined in submodules
     */
    var cwd = process.cwd();
    var modulesDir = cwd + '/app/modules';
    async.waterfall([

        function(callback) {
            // Read all of the files in '/app/modules', the submodules folder
            return fs.readdir(modulesDir, function(err, files) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, files);
                }
            });
        },
        function(files, callback) {
            // For each module, load the module if 'routes.js' is found in the folder
            async.each(files, readModule, callback);
        }
    ], function() {
        // Everything else should go to a 404 page.
        app.all('*', index.lost);
    });
}