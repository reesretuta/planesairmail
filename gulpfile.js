var gulp = require('gulp');

var _ = require('lodash');

var fs = require('fs');

var gutil = require('gulp-util');
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
var jsSrc = [jsSrcFolder + '/**/*.js', jsSrcFolder + '/**/*.hbs'];

var sassSrcFolder = './css/scss';
var cssFolder = './css';
var sassSrc = [sassSrcFolder + '/*.scss', sassSrcFolder + '/**/*.scss'];


// =================================================================== //
/* *************************** Gulp Tasks **************************** */
// =================================================================== //

// Browserify JS
gulp.task('browserify', function() {
    "use strict";

    // Single entry point to browserify
    gulp.src(jsSrcFolder + '/app.js')
        .pipe(browserify({
            debug: true,
            transform: ['hbsfy']
        }))
        .on('error', function(e) {
            gutil.log(gutil.colors.red(e.message));
            gutil.beep();
        })
        .pipe(gulp.dest(jsBuildFolder));

});

// Concatenate and minify js
gulp.task('minify', function() {

    // order of source files is important,
    // underscore & jquery must be included before backbone.js or other libraries
    var minifySrcFiles = [
        jsLibFolder + '/underscore-min.js',
        jsLibFolder + '/jquery-1.11.1.min.js',
        jsLibFolder + '/*.js',
        jsBuildFolder + '/app.js'
    ];

    gulp.src(minifySrcFiles)
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsBuildFolder));
});

// Compile Sass
gulp.task('sass', function() {

    gulp.src(sassSrcFolder + '/app.scss')
        .pipe(sass())
        .on('error', function(e) {
            gutil.log(gutil.colors.red(e.message));
            gutil.beep();
        })
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7", { cascade: true }))
        .pipe(gulp.dest(cssFolder));
});


// Watch Our Files
gulp.task('watch', function () {
    gulp.watch(jsSrc, ['browserify']);

    gulp.watch([jsBuildFolder + '/app.js', jsLibFolder + '/*.js'], ['minify']);

    gulp.watch(sassSrc, ['sass']);
});


function getDirFiles(directories) {
    "use strict";

    return _.map(directories, function(dir) {
        return _.map(fs.readdirSync(dir), function(file) {
            return dir + '/' + file;
        });
    });
}



gulp.task('assets', function() {
    "use strict";

    var directories = ['assets/introVideo', 'assets/wipescreen'];

    var files = JSON.stringify(_.flatten(getDirFiles(directories)));

    files = files.split(',').join(',\n');

    fs.writeFile('./assets/assets.json', files, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });

});




// Default
gulp.task('default', ['browserify', 'sass', 'watch']);


