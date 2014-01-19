/*
 * file: Gruntfile.js
 * Copyright (c) 2013, Cyan, Inc. All rights reserved.
 */
'use strict';

var nconf = require('nconf');
var handlebars = require('handlebars');

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /************************************************************************************
     * Setting & variables
     ************************************************************************************/

    nconf.argv().env().defaults({
        // Define global directories that will be used in the next defaults() function
        'in-dir': 'client',
        'out-dir': 'production',
        'out-dir-dev': 'development',
        'tmp-dir-build': '.tmp-build'
    }).defaults({
        // Define build specific directories
        // Global directories is included twice because otherwise nconf won't be able to use these
        // global directories
        'in-dir': 'client',
        'out-dir': 'production',
        'out-dir-dev': 'development',
        'tmp-dir-build': '.tmp-build',
        'css-src-dir': nconf.get('in-dir') + '/css',
        'css-dest-dir': nconf.get('out-dir') + '/css',
        'css-dest-dir-dev': nconf.get('out-dir-dev') + '/css',
        'ts-views-dir': 'server/views',
        'ts-src-dir': nconf.get('in-dir') + '/js',
        'ts-tmp-dir': nconf.get('tmp-dir-build') + '/ts',
        'ts-dest-dir': nconf.get('out-dir') + '/js',
        'ts-dest-dir-dev': nconf.get('out-dir-dev') + '/js',
        'tmpl-src-dir': nconf.get('in-dir') + '/tmpl',
        'tmpl-tmp-dir': nconf.get('tmp-dir-build') + '/tmpl',
        'tmpl-dest-dir': nconf.get('out-dir') + '/js',
        'tmpl-dest-dir-dev': nconf.get('out-dir-dev') + '/js'
    });

    // Symlink all folder / files except the ones in js, css & tmpl
    var others = ['**/*', '!js/**/*', '!js', '!css/**/*', '!css', '!tmpl/**/*', '!tmpl'];
    var cleanOthers = [
        nconf.get('out-dir') + '/**/*',
        '!' + nconf.get('out-dir') + '/js/**/*',
        '!' + nconf.get('out-dir') + '/css/**/*',
        '!' + nconf.get('out-dir') + '/tmpl/**/*',
        nconf.get('out-dir-dev') + '/**/*',
        '!' + nconf.get('out-dir-dev') + '/js/**/*',
        '!' + nconf.get('out-dir-dev') + '/css/**/*',
        '!' + nconf.get('out-dir-dev') + '/tmpl/**/*'
    ];

    /************************************************************************************
     * Setting & variables
     ************************************************************************************/

    grunt.initConfig({
        clean: {
            all: [nconf.get('out-dir'), nconf.get('out-dir-dev'), nconf.get('tmp-dir-build')],
            css: [nconf.get('css-dest-dir'), nconf.get('css-dest-dir-dev')],
            ts: [nconf.get('ts-dest-dir'), nconf.get('ts-dest-dir-dev'), nconf.get('ts-tmp-dir')],
            tmpl: [nconf.get('tmpl-dest-dir'), nconf.get('tmpl-dest-dir-dev'), nconf.get('tmpl-tmp-dir')],
            others: cleanOthers
        },
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
                    dest: nconf.get('ts-tmp-dir'),
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
            },
            others: {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: others,
                    dest: nconf.get('out-dir-dev'),
                    filter: 'isFile'
                }]
            }
        },
        copy: {
            others: {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: others,
                    dest: nconf.get('out-dir')
                }]
            }
        },
        htmlmin: { // Task
            others: { // Target
                options: { // Target options
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeCDATASectionsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: ['**/*.html'],
                    dest: nconf.get('out-dir'),
                    filter: 'isFile'
                }]
            }
        },
        minjson: {
            others: {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: ['**/*.json'],
                    dest: nconf.get('out-dir'),
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
                src: [nconf.get('ts-tmp-dir') + '/**/*.ts'],
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourcemap: false,
                    declaration: false,
                    comments: false
                }
            }
        },
        exec: {
            js: {
                command: function() {
                    var template = handlebars.compile('grep -nr "data\-main" {{VIEW}} | while read line; do file=`echo "$line" | sed "s|^.*data-main\s*=\s*||" | tr -d "()\"\\\'"" | sed "s|^\\\/||; s|{{STATIC}}|{{TMP}}|"`; if [[ "$file" != *.min ]]; then outfile=`echo "$file.js" | sed "s|^{{TMP}}|{{DEST}}|;s|\\\.js|\\\.min\\\.js|"`; r.js -o baseUrl=`dirname "$file"` name=`basename "$file"` out="$outfile";  echo "requirejs(["`basename "$file"`"]);" >> "$outfile"; fi; done');
                    var options = {
                        VIEW: nconf.get('ts-views-dir'),
                        TMP: nconf.get('ts-tmp-dir'),
                        DEST: nconf.get('ts-dest-dir'),
                        STATIC: 'static\\\/js'
                    }
                    return template(options);
                },
                stdout: true,
                stderr: true
            }
        },
        jade: {
            dev: {
                options: {
                    pretty: true,
                },
                files: [{
                    expand: true,
                    cwd: nconf.get('tmpl-src-dir'),
                    src: ['**/*.jade'],
                    dest: nconf.get('tmpl-tmp-dir'),
                    ext: '.tmpl'
                }]
            },
            prod: {
                options: {},
                files: [{
                    expand: true,
                    cwd: nconf.get('tmpl-src-dir'),
                    src: ['**/*.jade'],
                    dest: nconf.get('tmpl-tmp-dir'),
                    ext: '.tmpl'
                }]
            }
        },
        handlebars: {
            dev: {
                options: {
                    namespace: "Handlebars.templates",
                    processName: function(filePath) {
                        return filePath.replace(nconf.get('tmpl-tmp-dir') + "/", "").replace(".tmpl", "");
                    }
                },
                files: [{
                    src: nconf.get('tmpl-tmp-dir') + '/**/*.tmpl',
                    dest: nconf.get('tmpl-dest-dir-dev') + '/templates.js'
                }]
            },
            prod: {
                options: {
                    namespace: "Handlebars.templates",
                    processName: function(filePath) {
                        return filePath.replace(nconf.get('tmpl-tmp-dir') + "/", "").replace(".tmpl", "");
                    }
                },
                files: [{
                    src: nconf.get('tmpl-tmp-dir') + '/**/*.tmpl',
                    dest: nconf.get('tmpl-dest-dir') + '/templates.min.js'
                }]
            }
        },
        uglify: {
            tmpl: {
                files: [{
                    src: nconf.get('tmpl-dest-dir') + '/templates.min.js',
                    dest: nconf.get('tmpl-dest-dir') + '/templates.min.js'
                }]
            }
        }
    });

    grunt.registerTask('css', ['sass:prod']);
    grunt.registerTask('css-dev', ['sass:dev', 'symlink:css']);
    grunt.registerTask('js', ['symlink:js', 'ts:prod', 'exec:js']);
    grunt.registerTask('js-dev', ['symlink:js-dev', 'ts:dev']);
    grunt.registerTask('others', ['copy:others', 'minjson:others', 'htmlmin:others']);
    grunt.registerTask('others-dev', ['symlink:others']);
    grunt.registerTask('tmpl', ['jade:prod', 'handlebars:prod', 'uglify:tmpl']);
    grunt.registerTask('tmpl-dev', ['jade:dev', 'handlebars:dev']);

    grunt.registerTask('build', ['clean:all', 'css', 'js', 'tmpl', 'others']);
    grunt.registerTask('build-dev', ['clean:all', 'css-dev', 'js-dev', 'tmpl-dev', 'others-dev']);
};