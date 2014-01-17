/*
 * file: Gruntfile.js
 * Copyright (c) 2013, Cyan, Inc. All rights reserved.
 */
'use strict';

var nconf = require('nconf');

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    nconf.argv().env().defaults({
        'in-dir': 'client',
        'out-dir': 'production',
        'out-dir-dev': 'development',
        'tmp-dir-build': '.tmp-build'
    }).defaults({
        'css-src-dir': nconf.get('in-dir') + '/css',
        'css-dest-dir': nconf.get('out-dir') + '/css',
        'css-dest-dir-dev': nconf.get('out-dir-dev') + '/css',
        'ts-src-dir': nconf.get('in-dir') + '/js',
        'ts-mid-dir': nconf.get('tmp-dir-build') + '/ts',
        'ts-dest-dir': nconf.get('out-dir') + '/js',
        'ts-dest-dir-dev': nconf.get('out-dir-dev') + '/js'
    });

    grunt.initConfig({
        symlink: {
            css: {
                files: [{
                    expand: true,
                    cwd: nconf.get('css-src-dir'),
                    src: ['**/*'],
                    dest: nconf.get('css-dest-dir-dev'),
                    filter: 'isFile'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: nconf.get('ts-src-dir'),
                    src: ['**/*'],
                    dest: nconf.get('ts-mid-dir'),
                    filter: 'isFile'
                }]
            },
            'js-dev': {
                files: [{
                    expand: true,
                    cwd: nconf.get('ts-src-dir'),
                    src: ['**/*'],
                    dest: nconf.get('ts-dest-dir-dev'),
                    filter: 'isFile'
                }]
            }
        },
        sass: {
            prod: {
                options: {
                    trace: true,
                    unixNewlines: true,
                    style: 'compressed',
                    noCache: true
                },
                files: [{
                    expand: true,
                    cwd: nconf.get('css-src-dir'),
                    src: ['**/*.sass', '!**/_*.sass', '**/*.scss', '!**/_*.scss'],
                    dest: nconf.get('css-dest-dir'),
                    ext: '.min.css'
                }]
            },
            dev: {
                options: {
                    sourcemap: true,
                    trace: true,
                    unixNewlines: true,
                    noCache: true
                },
                files: [{
                    expand: true,
                    cwd: nconf.get('css-src-dir'),
                    src: ['**/*.sass', '!**/_*.sass', '**/*.scss', '!**/_*.scss'],
                    dest: nconf.get('css-dest-dir-dev'),
                    ext: '.css'
                }]
            }
        },
        ts: {
            dev: {
                src: [nconf.get('ts-dest-dir-dev') + '/**/*.ts'],
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourcemap: true,
                    declaration: false,
                    comments: false
                }
            },
            prod: {
                src: [nconf.get('ts-mid-dir') + '/**/*.ts'],
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourcemap: false,
                    declaration: false,
                    comments: false
                }
            }
        },
        shell: {
            js: {
                options: { // Options
                    stdout: true
                },
                command: 'scripts/r.js.sh'
            }
        }
    });

    // Development build
    grunt.registerTask('css', ['sass:prod']);
    grunt.registerTask('css-dev', ['sass:dev', 'symlink:css']);
    grunt.registerTask('js', ['symlink:js', 'ts:prod', 'shell:js']);
    grunt.registerTask('js-dev', ['symlink:js-dev', 'ts:dev']);

};