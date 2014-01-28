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
        'views-dir': 'server/views',
        'tmp-dir-build': '.tmp-build',
        'module': '*'
    });

    var outDir = nconf.get('out-dir'),
        outDirDev = nconf.get('out-dir-dev'),
        cssSrc = nconf.get('module') + '/css/**/*',
        tsSrc = nconf.get('module') + '/js/**/*.ts',
        tsTmpDir = nconf.get('tmp-dir-build'),
        tmplSrc = nconf.get('module') + '/js/**/*.jade',
        oldTmplSrc = [nconf.get('module') + '/tmpl/**/*.jade', '!' + nconf.get('module') + '/tmpl/**/_*.jade'],
        tmplTmpDir = nconf.get('tmp-dir-build') + '/tmpl',
        viewsOutDir = nconf.get('out-dir'),
        viewsOutDirDev = nconf.get('out-dir-dev'),
        viewsSrc = [
            nconf.get('module') + '/**/*.jade',
            '!' + nconf.get('module') + '/**/_*.jade'
        ];

    if (nconf.get('out')) {
        outDir = nconf.get('out');
        outDirDev = nconf.get('out');
    }

    nconf.set('css-src', nconf.get('module') + '/css/**/*');
    nconf.set('ts-src', nconf.get('module') + '/js/**/*');
    nconf.set('ts-tmp-dir', nconf.get('tmp-dir-build') + '/ts');
    nconf.set('tmpl-src', nconf.get('module') + '/tmpl/**/*.jade');
    nconf.set('tmpl-tmp-dir', nconf.get('tmp-dir-build') + '/tmpl');

    // Symlink all folder / files except the ones in js, css & tmpl
    var others = [
        nconf.get('module') + '/**/*',
        '!' + nconf.get('module') + '/js/**',
        '!' + nconf.get('module') + '/css/**',
        '!' + nconf.get('module') + '/tmpl/**'
    ];
    var cleanOthers = [
        outDir + '/' + nconf.get('module') + '/**/*',
        '!' + outDir + '/' + nconf.get('module') + '/js/**',
        '!' + outDir + '/' + nconf.get('module') + '/css/**',
        '!' + outDir + '/' + nconf.get('module') + '/tmpl/**',
        outDirDev + '/' + nconf.get('module') + '/**/*',
        '!' + outDirDev + '/' + nconf.get('module') + '/js/**',
        '!' + outDirDev + '/' + nconf.get('module') + '/css/**',
        '!' + outDirDev + '/' + nconf.get('module') + '/tmpl/**'
    ];

    /************************************************************************************
     * Setting & variables
     ************************************************************************************/

    grunt.initConfig({
        clean: {
            all: [outDir, outDirDev, nconf.get('tmp-dir-build')],
            css: [outDir + '/' + nconf.get('module') + '/css', outDirDev + '/' + nconf.get('module') + '/css'],
            ts: [outDir + '/' + nconf.get('module') + '/js', outDirDev + '/' + nconf.get('module') + '/js', tsTmpDir + '/' + nconf.get('module') + '/ts'],
            tmpl: [outDir + '/' + nconf.get('module') + '/tmpl', outDirDev + '/' + nconf.get('module') + '/tmpl', tsTmpDir + '/' + nconf.get('module') + '/tmpl'],
            others: cleanOthers
        },
        symlink: {
            css: {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: [cssSrc],
                    dest: outDirDev,
                    filter: 'isFile'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: [tsSrc],
                    dest: tsTmpDir,
                    filter: 'isFile'
                }]
            },
            'js-tmp-others': {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: others,
                    dest: tsTmpDir,
                    filter: 'isFile'
                }]
            },
            'js-dev': {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: [tsSrc],
                    dest: outDirDev,
                    filter: 'isFile'
                }]
            },
            others: {
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: others,
                    dest: outDirDev,
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
                    dest: outDir
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
                    dest: outDir,
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
                    dest: outDir,
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
                    cwd: nconf.get('in-dir'),
                    src: ['**/*.sass', '!**/_*.sass', '**/*.scss', '!**/_*.scss'],
                    dest: outDir,
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
                    cwd: outDirDev,
                    src: ['**/*.sass', '!**/_*.sass', '**/*.scss', '!**/_*.scss'],
                    dest: outDirDev,
                    ext: '.css'
                }]
            }
        },
        exec: {
            js: {
                command: function() {
                    var template = handlebars.compile('grep -nr "data\-main" {{VIEW}} | while read line; do file=`echo "$line" | sed "s|^.*data-main\s*=\s*||" | tr -d "()\"\\\'"" | perl -pe "s|{{STATIC}}|{{TMP}}|"`; if [[ "$file" != *.min ]]; then outfile=`echo "$file.js" | sed "s|^{{TMP}}|{{DEST}}|;s|\\\.js|\\\.min\\\.js|"`; r.js -o baseUrl=`dirname "$file"` name=`basename "$file"` out="$outfile";  echo "requirejs([\\\"`basename "$file"`\\\"]);" >> "$outfile"; fi; done');
                    var options = {
                        VIEW: nconf.get('views-dir') + '/' + nconf.get('module'),
                        TMP: tsTmpDir + '\\\/',
                        DEST: outDir + '\\\/',
                        STATIC: '^\\\/'
                    }
                    return template(options);
                },
                stdout: true,
                stderr: true
            },
            'tmpl-dev': {
                command: function() {
                    var template = handlebars.compile('find {{TMP}} -name "*.{{EXT}}" | while read file; do outfile=`echo "$file" | sed "s|{{TMP}}|{{DEST}}|; s|\\\.{{EXT}}|\\\.js|"`; handlebarsPath="{{HANDLEBARS}}"; echo "File \"$outfile\" created."; mkdir -p `dirname "$outfile"`; node_modules/handlebars/bin/handlebars "$file" -h "$handlebarsPath" -e "{{EXT}}" -r "`dirname $file`" -f "$outfile" -n "{{NAMESPACE}}" --amd {{ADDITIONAL}}; done');
                    var options = {
                        TMP: tsTmpDir,
                        EXT: 'tmpl',
                        DEST: outDirDev,
                        NAMESPACE: 'Handlebars.templates',
                        HANDLEBARS: 'core/lib/handlebars/js/',
                        ADDITIONAL: ''
                    };
                    return template(options);
                }
            },
            'tmpl-prod': {
                command: function() {
                    var template = handlebars.compile('find {{TMP}} -name "*.{{EXT}}" | while read file; do outfile=`echo "$file" | sed "s|{{TMP}}|{{DEST}}|; s|\\\.{{EXT}}|\\\.js|"`; moduleDir=`echo "$outfile" | perl -pe "s|^.*?\\\/.*?\\\/||; s|.*?\\\/|\\\.\\\.\\\/|g;"`; moduleDir=`dirname "$moduleDir"`; handlebarsPath="$moduleDir/{{HANDLEBARS}}"; echo "File \"$outfile\" created."; mkdir -p `dirname "$outfile"`; node_modules/handlebars/bin/handlebars "$file" -h "$handlebarsPath" -e "{{EXT}}" -r "`dirname $file`" -f "$outfile" -n "{{NAMESPACE}}" --amd {{ADDITIONAL}}; done');
                    var options = {
                        TMP: tsTmpDir,
                        EXT: 'tmpl',
                        DEST: tsTmpDir,
                        NAMESPACE: 'Handlebars.templates',
                        HANDLEBARS: 'lib/handlebars/js/',
                        ADDITIONAL: '--min'
                    };
                    return template(options);
                }
            },
            install: {
                command: function() {
                    return 'cd ' + __dirname + '; make install;'
                },
                stdout: true,
                stderr: true
            }
        },
        jade: {
            'tmpl-dev': {
                options: {
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: [tmplSrc],
                    dest: tsTmpDir,
                    ext: '.tmpl'
                }]
            },
            'tmpl-prod': {
                options: {},
                files: [{
                    expand: true,
                    cwd: nconf.get('in-dir'),
                    src: [tmplSrc],
                    dest: tsTmpDir,
                    ext: '.tmpl'
                }]
            }
        },
        watch: {
            ts: {
                files: tsSrc,
                tasks: ['clean:ts', 'js-dev'],
                options: {
                    cwd: nconf.get('in-dir'),
                    debounceDelay: 250
                }
            },
            css: {
                files: cssSrc,
                tasks: ['clean:css', 'css-dev'],
                options: {
                    cwd: nconf.get('in-dir'),
                    debounceDelay: 250
                }
            },
            others: {
                files: others,
                tasks: ['clean:others', 'others-dev'],
                options: {
                    cwd: nconf.get('in-dir'),
                    debounceDelay: 250
                }
            }
        }
    });

    function compileTs(tsSrcDir, enableSrcMap, callback) {
        return function() {
            // read all subdirectories from typescript folder
            grunt.file.expand(nconf.get('in-dir') + '/' + nconf.get('module')).forEach(function(dir) {
                // get the current ts config
                var ts = grunt.config.get('ts') || {};
                var module = dir.replace(nconf.get('in-dir') + '/', "");

                var dirTsSrc = [tsSrcDir + '/' + module + '/**/*.ts', '!' + tsSrcDir + '/' + module + '/**/*.d.ts'];
                ts[dir] = {
                    src: dirTsSrc,
                    options: {
                        target: 'es5',
                        module: 'amd',
                        sourcemap: enableSrcMap,
                        declaration: false,
                        comments: false
                    }
                }
                // save the new ts config
                grunt.config.set('ts', ts);
            });
            // when finished run the compiler
            grunt.task.run('ts');
            // call the callback
            if (callback) callback();
        }
    };

    grunt.registerTask('ts-dev', 'Compile typescript files in development', compileTs(outDirDev, true));
    grunt.registerTask('ts-prod', 'Compile typescript files in production', compileTs(tsTmpDir, false));

    grunt.registerTask('install', ['exec:install']);

    grunt.registerTask('css', ['sass:prod']);
    grunt.registerTask('css-dev', ['symlink:css', 'sass:dev']);
    grunt.registerTask('js', ['symlink:js', 'symlink:js-tmp-others', 'jade:tmpl-prod', 'exec:tmpl-prod', 'ts-prod', 'exec:js']);
    grunt.registerTask('js-dev', ['symlink:js-dev', 'jade:tmpl-dev', 'exec:tmpl-dev', 'ts-dev']);
    grunt.registerTask('others', ['copy:others', 'minjson:others', 'htmlmin:others']);
    grunt.registerTask('others-dev', ['symlink:others']);

    grunt.registerTask('watch-ts', ['watch:ts']);
    grunt.registerTask('watch-css', ['watch:css']);
    grunt.registerTask('watch-others', ['watch:others']);

    grunt.registerTask('build', ['clean:all', 'css', 'js', 'others']);
    grunt.registerTask('build-dev', ['clean:all', 'css-dev', 'js-dev', 'others-dev']);

    grunt.registerTask('default', ['install', 'build']);
};