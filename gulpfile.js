var gulp = require('gulp'),
    gulp_file = require('gulp-file'),
    gulp_concat = require('gulp-concat'),
    gulp_replace = require('gulp-replace'),
    gulp_if = require('gulp-if'),
    gulp_uglify = require('gulp-uglify'),
    gulp_prettify = require('gulp-jsbeautifier'),
    gulp_sourcemaps = require('gulp-sourcemaps'),
    gulp_typescript = require('gulp-typescript'),
    gulp_jade = require('gulp-jade'),
    gulp_sass = require('gulp-sass'),
    gulp_del = require('del'),
    gulp_shell = require('gulp-shell'),
    gulp_sequence = require('run-sequence');

var gulpConfig = require('./gulpfile.config.js');
var packageJson = require('./package.json');

/*
 * CLIENT BUILDING TASKS
 * ---------------------
 * */

/*
 *  Compiling Jade templates to HTML (files that end with .include.jade are ignored)
 */
gulp.task('client-app-html', function () {
    return gulp.src([
            './' + gulpConfig.FOLDERS.SOURCES.CLIENT + '/**/*.jade',
            '!./' + gulpConfig.FOLDERS.SOURCES.CLIENT + '/**/*.include.jade'
        ])
        .pipe(gulp_jade({
            locals: {gulpConfig: gulpConfig}
        }))
        .pipe(gulp.dest('./' + gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT));
});

/*
 *   Compiling TypeScript to JavaScript, minified for production and with sourcemaps for development
 */
gulp.task('client-app-scripts', function () {

    return gulp.src('./' + gulpConfig.FOLDERS.SOURCES.CLIENT + '/app/**/*.ts', {base: './' + gulpConfig.FOLDERS.SOURCES.CLIENT + '/app'})
        .pipe(gulp_replace('// GULP: Enable/Disable Production Mode', gulpConfig.PRODUCTION ? 'enableProdMode();' : ''))
        .pipe(gulp_typescript(
            gulp_typescript.createProject('tsconfig.json', {typescript: require('typescript')})
        )).js
        .pipe(gulp_if(!gulpConfig.PRODUCTION, gulp_sourcemaps.init()))
        .pipe(gulp_if(gulpConfig.PRODUCTION, gulp_uglify()))
        .pipe(gulp_if(!gulpConfig.PRODUCTION, gulp_sourcemaps.write('.')))
        .pipe(gulp.dest('./' + gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.APP));
});


/*
 *  Compiling SCSS files to CSS (files that end with .include.scss are ignored)
 */
gulp.task('client-app-styles', function () {
    return gulp.src([
            './' + gulpConfig.FOLDERS.SOURCES.CLIENT + '/styles/*.scss',
            '!./' + gulpConfig.FOLDERS.SOURCES.CLIENT + '/styles/*.include.scss'
        ],
        {base: './' + gulpConfig.FOLDERS.SOURCES.CLIENT + '/styles'})
        .pipe(gulp_concat('app.css'))
        .pipe(gulp_if(!gulpConfig.PRODUCTION, gulp_sourcemaps.init()))
        .pipe(gulp_sass())
        .pipe(gulp_if(!gulpConfig.PRODUCTION, gulp_sourcemaps.write('.')))
        .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.STYLES));
});

/*
 *  Preparing vendor scripts as libraries bundle and Angular2 related scripts bundle
 */
gulp.task('client-vendor-scripts', function () {

    var utilityLibraries = [];

    if (gulpConfig.UTILITIES.JQUERY) {
        utilityLibraries.push('node_modules/jquery/dist/jquery' + (gulpConfig.PRODUCTION ? '.min' : '') + '.js');
    }

    if (gulpConfig.UTILITIES.LODASH) {
        utilityLibraries.push('node_modules/lodash/lodash.js');
    }

    if (gulpConfig.UTILITIES.MOMENT) {
        utilityLibraries.push('node_modules/moment/min/' + (gulpConfig.UTILITIES.MOMENT_WITH_LOCALES ? 'moment-with-locales.min' : 'moment.min') + '.js')
    }

    return gulp.src([
                'node_modules/angular2/bundles/angular2-polyfills' + (gulpConfig.PRODUCTION ? '.min' : '') + '.js',
                'node_modules/systemjs/dist/system.src.js',
                'node_modules/rxjs/bundles/Rx' + (gulpConfig.PRODUCTION ? '.min' : '') + '.js',
                'node_modules/angular2/bundles/angular2.' + (gulpConfig.PRODUCTION ? 'min' : 'dev') + '.js',
                'node_modules/angular2/bundles/router.' + (gulpConfig.PRODUCTION ? 'min' : 'dev') + '.js',
                'node_modules/angular2/bundles/http.' + (gulpConfig.PRODUCTION ? 'min' : 'dev') + '.js'
            ])
            .pipe(gulp_concat('angular2.js'))
            .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.VENDOR)) &&

        gulp.src(utilityLibraries)
            .pipe(gulp_concat('utilities.js'))
            .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.VENDOR)) &&

        gulp.src([
                'node_modules/systemjs/dist/system-polyfills.js',
                'node_modules/es6-shim/es6-shim.min.js'
            ])
            .pipe(gulp_concat('ie_polyfills.js'))
            .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.VENDOR)) &&

        gulp.src([
                'node_modules/rxjs/bundles/Rx.min.js.map',
                'node_modules/jquery/dist/jquery.min.map'
            ])
            .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.VENDOR))
});

/*
 *  Preparing styles that are bundled with vendor libraries
 */
gulp.task('client-vendor-styles', function () {
    gulp.src([
            'node_modules/css-wipe/reset.css'
        ])
        .pipe(gulp_concat('vendor.css'))
        .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.VENDOR));
});

/*
 *  Copying images resources to distribution folder
 */
gulp.task('client-resources-images', function () {
    gulp
        .src(gulpConfig.FOLDERS.SOURCES.CLIENT + '/resources/images/**/*')
        .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT + '/' + gulpConfig.FOLDERS.CLIENT.CONTENT.IMAGES));
});

/*
 *  Copying favicons to distribution root folder agents ignoring meta tags
 */
gulp.task('client-resources-favicons', function () {
    gulp.src([
            gulpConfig.FOLDERS.SOURCES.CLIENT + '/resources/images/favicons/favicon.ico',
            gulpConfig.FOLDERS.SOURCES.CLIENT + '/resources/images/favicons/favicon.png'
        ])
        .pipe(gulp.dest(gulpConfig.FOLDERS.DIST + '/' + gulpConfig.FOLDERS.CLIENT.ROOT));
});

/*
 * SERVER BUILDING TASKS
 * ---------------------
 * */

/*
 *  Copying server scripts, minified for production
 */
gulp.task('server-scripts', function () {
    return gulp
        .src('./' + gulpConfig.FOLDERS.SOURCES.SERVER + '/**/*.js')
        .pipe(gulp_if(gulpConfig.PRODUCTION, gulp_uglify()))
        .pipe(gulp.dest('./' + gulpConfig.FOLDERS.DIST));
});

/*
 *  Copying server's package.json to distribution folder adding info from project's file
 */
gulp.task('server-package-json', function () {
    return gulp.src('./' + gulpConfig.FOLDERS.SOURCES.SERVER + '/package.json')
        .pipe(gulp_replace('{{PACKAGE_JSON_NAME}}', packageJson.name))
        .pipe(gulp_replace('{{PACKAGE_JSON_VERSION}}', packageJson.version))
        .pipe(gulp_replace('{{PACKAGE_JSON_DESCRIPTION}}', packageJson.description))
        .pipe(gulp_replace('{{PACKAGE_JSON_LICENSE}}', packageJson.license))
        .pipe(gulp.dest('./' + gulpConfig.FOLDERS.DIST));
});

/*
 *  Creating and copying to distribution server configuration file
 */
gulp.task('server-config-json', function () {
    var configJson = {
        isProduction: gulpConfig.PRODUCTION,
        server: {
            ports: {
                production: gulpConfig.PORT.PRODUCTION,
                development: gulpConfig.PORT.DEVELOPMENT
            },
            staticFolder: gulpConfig.FOLDERS.CLIENT.ROOT,
            apiBasePath: gulpConfig.FOLDERS.SERVER.API_BASE_PATH,
            customErrorPages: gulpConfig.FEATURES.CUSTOM_ERROR_PAGES
        },
        logging: {
            requests: {
                enabled: gulpConfig.LOGS.REQUESTS_LOGS_ENABLED,
                onlyErrors: gulpConfig.PRODUCTION,
                folder: gulpConfig.FOLDERS.SERVER.REQUESTS_LOGS,
                format: gulpConfig.LOGS.REQUESTS_FORMAT
            },
            activity: {
                enabled: gulpConfig.LOGS.ACTIVITY_LOGS_ENABLED,
                level: gulpConfig.PRODUCTION ? 'error' : 'info',
                folder: gulpConfig.FOLDERS.SERVER.ACTIVITY_LOGS,
                jsonFormat: gulpConfig.LOGS.ACTIVITY_JSON_FORMAT,
                sizePerFileInMegabytes: gulpConfig.LOGS.ACTIVITY_MAX_SIZE_MB,
                maximumNumberOfFiles: gulpConfig.LOGS.ACTIVITY_MAX_FILES
            }
        }
    };

    return gulp_file('config.json', JSON.stringify(configJson), {src: true})
        .pipe(gulp_prettify())
        .pipe(gulp.dest(gulpConfig.FOLDERS.DIST));
});

/*
 *  Executing npm packages in distribution folder for server
 */
gulp.task('server-npm-install', gulp_shell.task('npm install', {cwd: './' + gulpConfig.FOLDERS.DIST}));

/*
 * UTILITIES
 * ---------
 * */

/*
 *  Cleaning distribution folder
 */
gulp.task('_clean', function () {
    return gulp_del.sync([gulpConfig.FOLDERS.DIST]);
});

/*
 *  Starting NodeJS server
 */
gulp.task('_start', gulp_shell.task('node index.js', {cwd: './' + gulpConfig.FOLDERS.DIST}));

/*
 * AGGREGATION TASKS
 * -----------------
 * */

/*
 *  Building client
 */
gulp.task('_client', [
    'client-app-html',
    'client-app-scripts',
    'client-app-styles',
    'client-resources-images',
    'client-resources-favicons',
    'client-vendor-scripts',
    'client-vendor-styles'
], function () {
});

/*
 *  Building server
 */
gulp.task('_server', function (callback) {
    gulp_sequence([
            'server-config-json',
            'server-package-json',
            'server-scripts'
        ], 'server-npm-install',
        callback);
});

/*
 *  Building solution to distribution folder
 */
gulp.task('_build-all', ['_server', '_client'], function () {
});

/*
 *  Building solution from scratch and executing server
 */
gulp.task('default', [], function (callback) {
    gulp_sequence(
        '_clean',
        '_build-all',
        '_start',
        callback);
});
