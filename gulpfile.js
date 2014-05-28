var gulp = require('gulp');

var _ = require('lodash');

var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

// =================================================================== //
/* **************************** Variables **************************** */
// =================================================================== //

var jsSrcFolder = './js/src';
var jsLibFolder = './js/lib';
var jsBuildFolder = './js/build';
var jsSrc = jsSrcFolder + '/**/*.js';

var sassSrcFolder = './css/scss';
var cssFolder = './css';
var sassSrc = sassSrcFolder + '/main.scss';


// =================================================================== //
/* *************************** Gulp Tasks **************************** */
// =================================================================== //

// Browserify JS
gulp.task('browserify', function() {
    "use strict";

    // Single entry point to browserify
    gulp.src(jsSrcFolder + '/app.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: true,
            transform: ['hbsfy']
        }))
        .on('error',function(e) {
            console.log('error');
            console.log(e.message);
        })
        .pipe(gulp.dest(jsBuildFolder));
});

// Concatenate and minify js
gulp.task('minify', function() {
    gulp.src([jsLibFolder + '/underscore-min.js', jsLibFolder + '/jquery-1.11.1.min.js', jsLibFolder + '/*.js', jsBuildFolder + '/app.js'])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsBuildFolder));
});

// Compile Sass
gulp.task('sass', function() {
    gulp.src(sassSrcFolder + '/app.scss')
        .pipe(sass())
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7", { cascade: true }))
        .pipe(gulp.dest(cssFolder));
});


// Watch Our Files
gulp.task('watch', function () {
    gulp.watch(jsSrc, ['browserify']);

    gulp.watch([jsBuildFolder + '/app.js', jsLibFolder + '/*.js'], ['minify']);

    gulp.watch(sassSrc, ['sass']);
});

// Default
gulp.task('default', ['browserify', 'sass', 'watch']);


