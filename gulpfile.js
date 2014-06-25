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






function prepend(str, arr) {
    "use strict";

    return _.map(arr, function(el) {
        return str + '/' + el;
    });
}

function isImageOrFolder(str) {
    "use strict";
    var parts = str.split('.');
    var ext = parts[parts.length-1];

    return fs.lstatSync(str).isDirectory() || ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif';
}

function getFiles(dir) {
    "use strict";

    var folders = _.filter(prepend(dir, fs.readdirSync(dir)), isImageOrFolder);

    var files = _.map(folders, function(item) {
        if(fs.lstatSync(item).isDirectory()) {
            return getFiles(item);
        } else {
            return [item];
        }
    });

    return _.flatten(files);
}

function getFileSize(file) {
    "use strict";

    return fs.statSync(file).size;
}

gulp.task('assets', function() {
    "use strict";

    var dir = 'assets';
    var destinationFile = './js/src/data/assets.json';

    var files = getFiles(dir);

    var fileSizes = _.map(files, getFileSize);
    var totalAssetSize = _.reduce(fileSizes, function(total, size) {
        return total + size;
    });

    var assetData = {
        totalSize: totalAssetSize,
        assets: _.zipObject(files, fileSizes)
    };

    var fileData = JSON.stringify(assetData, null, "\t");

    fs.writeFile(destinationFile, fileData, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });

});




// Default
gulp.task('default', ['browserify', 'sass', 'watch']);


