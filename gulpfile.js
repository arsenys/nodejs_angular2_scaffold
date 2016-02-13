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

var gulpSettings = require('./gulpfile.config.js');
var packageJson = require('./package.json');

/*
 * CLIENT
 * */

gulp.task('client-app-html', function () {
    return gulp.src([
            './' + gulpSettings.FOLDERS.SOURCES.CLIENT + '/**/*.jade',
            '!./' + gulpSettings.FOLDERS.SOURCES.CLIENT + '/**/*.include.jade'
        ])
        .pipe(gulp_jade({
            locals: {gulpSettings: gulpSettings}
        }))
        .pipe(gulp.dest('./' + gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT));
});

gulp.task('client-app-scripts', function () {
    var tsProject = gulp_typescript.createProject(
        'tsconfig.json',
        {
            typescript: require('typescript')
        }
    );

    var tsResult = gulp.src('./' + gulpSettings.FOLDERS.SOURCES.CLIENT + '/app/**/*.ts', {base: './' + gulpSettings.FOLDERS.SOURCES.CLIENT + '/app'})
        .pipe(gulp_replace('// GULP: Enable/Disable Production Mode', gulpSettings.PRODUCTION ? 'enableProdMode();' : ''))
        .pipe(gulp_typescript(tsProject));

    return tsResult.js
        .pipe(gulp_if(!gulpSettings.PRODUCTION, gulp_sourcemaps.init()))
        .pipe(gulp_if(gulpSettings.PRODUCTION, gulp_uglify()))
        .pipe(gulp_if(!gulpSettings.PRODUCTION, gulp_sourcemaps.write('.')))
        .pipe(gulp.dest('./' + gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.APP));
});

gulp.task('client-app-styles', function () {
    return gulp.src([
            './' + gulpSettings.FOLDERS.SOURCES.CLIENT + '/styles/*.scss',
            '!./' + gulpSettings.FOLDERS.SOURCES.CLIENT + '/styles/*.include.scss'
        ],
        {
            base: './' + gulpSettings.FOLDERS.SOURCES.CLIENT + '/styles'
        })
        .pipe(gulp_concat('app.css'))
        .pipe(gulp_if(!gulpSettings.PRODUCTION, gulp_sourcemaps.init()))
        .pipe(gulp_sass())
        .pipe(gulp_if(!gulpSettings.PRODUCTION, gulp_sourcemaps.write('.')))
        .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.STYLES));
});

gulp.task('client-vendor-scripts', function () {

    var utilityLibraries = [];

    if (gulpSettings.UTILITIES.JQUERY) {
        utilityLibraries.push('node_modules/jquery/dist/jquery' + (gulpSettings.PRODUCTION ? '.min' : '') + '.js');
    }

    if (gulpSettings.UTILITIES.LODASH) {
        utilityLibraries.push('node_modules/lodash/lodash.js');
    }

    if (gulpSettings.UTILITIES.MOMENT) {
        utilityLibraries.push('node_modules/moment/min/' + (gulpSettings.UTILITIES.MOMENT_WITH_LOCALES ? 'moment-with-locales.min' : 'moment.min') + '.js')
    }

    return gulp.src([
                'node_modules/angular2/bundles/angular2-polyfills' + (gulpSettings.PRODUCTION ? '.min' : '') + '.js',
                'node_modules/systemjs/dist/system.src.js',
                'node_modules/rxjs/bundles/Rx' + (gulpSettings.PRODUCTION ? '.min' : '') + '.js',
                'node_modules/angular2/bundles/angular2.' + (gulpSettings.PRODUCTION ? 'min' : 'dev') + '.js',
                'node_modules/angular2/bundles/router.' + (gulpSettings.PRODUCTION ? 'min' : 'dev') + '.js',
                'node_modules/angular2/bundles/http.' + (gulpSettings.PRODUCTION ? 'min' : 'dev') + '.js'
            ])
            .pipe(gulp_concat('angular2.js'))
            .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.VENDOR)) &&

        gulp.src(utilityLibraries)
            .pipe(gulp_concat('utilities.js'))
            .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.VENDOR)) &&

        gulp.src([
                'node_modules/systemjs/dist/system-polyfills.js',
                'node_modules/es6-shim/es6-shim.min.js'
            ])
            .pipe(gulp_concat('ie_polyfills.js'))
            .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.VENDOR)) &&

        gulp.src([
                'node_modules/rxjs/bundles/Rx.min.js.map',
                'node_modules/jquery/dist/jquery.min.map'
            ])
            .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.VENDOR))
});

gulp.task('client-vendor-styles', function () {
    gulp.src([
            'node_modules/css-wipe/reset.css'
        ])
        .pipe(gulp_concat('vendor.css'))
        .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.VENDOR));
});

gulp.task('client-resources-images', function () {
    gulp.src([
            gulpSettings.FOLDERS.SOURCES.CLIENT + '/resources/images/**/*'
        ])
        .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT + '/' + gulpSettings.FOLDERS.CLIENT.CONTENT.IMAGES));
});

gulp.task('client-resources-favicons', function () {
    gulp.src([
            gulpSettings.FOLDERS.SOURCES.CLIENT + '/resources/images/favicons/favicon.ico',
            gulpSettings.FOLDERS.SOURCES.CLIENT + '/resources/images/favicons/favicon.png'
        ])
        .pipe(gulp.dest(gulpSettings.FOLDERS.DIST + '/' + gulpSettings.FOLDERS.CLIENT.ROOT));
});

/*
 * SERVER
 * */

gulp.task('server-scripts', function () {
    return gulp.src('./' + gulpSettings.FOLDERS.SOURCES.SERVER + '/**/*.js')
        .pipe(gulp_replace('{{GULP_SETTINGS_PORT_DEVELOPMENT}}', gulpSettings.PORT.DEVELOPMENT))
        .pipe(gulp_replace('{{GULP_SETTINGS_PORT_PRODUCTION}}', gulpSettings.PORT.PRODUCTION))
        .pipe(gulp_replace('{{GULP_SETTINGS_CLIENT_ROOT}}', gulpSettings.FOLDERS.CLIENT.ROOT))
        .pipe(gulp_replace('{{GULP_SETTINGS_API_BASE_PATH}}', gulpSettings.FOLDERS.SERVER.API_BASE_PATH))
        .pipe(gulp_replace('{{GULP_SETTINGS_REQUESTS_LOGS_PATH}}', gulpSettings.FOLDERS.SERVER.REQUESTS_LOGS))
        .pipe(gulp_replace('{{GULP_SETTINGS_ACTIVITY_LOGS_PATH}}', gulpSettings.FOLDERS.SERVER.ACTIVITY_LOGS))
        .pipe(gulp_replace('{{REQUESTS_ONLY_ERRORS}}', gulpSettings.LOGS.REQUESTS_ONLY_ERRORS))
        .pipe(gulp_replace('{{REQUESTS_FORMAT}}', gulpSettings.LOGS.REQUESTS_FORMAT))
        .pipe(gulp.dest('./' + gulpSettings.FOLDERS.DIST));
});

gulp.task('server-package-json', function () {
    return gulp.src('./' + gulpSettings.FOLDERS.SOURCES.SERVER + '/package.json')
        .pipe(gulp_replace('{{PACKAGE_JSON_NAME}}', packageJson.name))
        .pipe(gulp_replace('{{PACKAGE_JSON_VERSION}}', packageJson.version))
        .pipe(gulp_replace('{{PACKAGE_JSON_DESCRIPTION}}', packageJson.description))
        .pipe(gulp_replace('{{PACKAGE_JSON_LICENSE}}', packageJson.license))
        .pipe(gulp.dest('./' + gulpSettings.FOLDERS.DIST));
});

gulp.task('server-config-json', function () {
    var configJson = {
        isProduction: gulpSettings.PRODUCTION,
        server: {
            ports: {
                production: gulpSettings.PORT.PRODUCTION,
                development: gulpSettings.PORT.DEVELOPMENT
            },
            staticFolder: gulpSettings.FOLDERS.CLIENT.ROOT,
            customErrorPages: true
        },
        logging: {
            requests: {
                enabled: gulpSettings.LOGS.REQUESTS_LOGS_ENABLED,
                onlyErrors: gulpSettings.PRODUCTION,
                folder: gulpSettings.FOLDERS.SERVER.REQUESTS_LOGS,
                format: gulpSettings.LOGS.REQUESTS_FORMAT
            },
            activity: {
                enabled: gulpSettings.LOGS.ACTIVITY_LOGS_ENABLED,
                level: gulpSettings.PRODUCTION ? 'error' : 'info',
                folder: gulpSettings.FOLDERS.SERVER.ACTIVITY_LOGS,
                jsonFormat: gulpSettings.LOGS.ACTIVITY_JSON_FORMAT,
                sizePerFileInMegabytes: gulpSettings.LOGS.ACTIVITY_MAX_SIZE_MB,
                maximumNumberOfFiles: gulpSettings.LOGS.ACTIVITY_MAX_FILES
            }
        }
    };

    return gulp_file('config.json', JSON.stringify(configJson), {src: true})
        .pipe(gulp_prettify())
        .pipe(gulp.dest(gulpSettings.FOLDERS.DIST));
});

gulp.task('server-npm-install', gulp_shell.task('npm install', {cwd: './' + gulpSettings.FOLDERS.DIST}));

/*
 * UTILITIES
 * */

gulp.task('_clean', function () {
    return gulp_del.sync([gulpSettings.FOLDERS.DIST]);
});

gulp.task('_start', gulp_shell.task('node index.js', {cwd: './' + gulpSettings.FOLDERS.DIST}));

/*
 * AGGREGATION TASKS
 * */

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

gulp.task('_server', function (callback) {
    gulp_sequence([
            'server-config-json',
            'server-package-json',
            'server-scripts'
        ], 'server-npm-install',
        callback);
});

gulp.task('_build-all', ['_server','_client'], function () {});

gulp.task('default', [], function (callback) {
    gulp_sequence('_clean', '_build-all', '_start', callback);
});
