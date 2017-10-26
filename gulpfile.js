var gulp = require('gulp');
var gulpBabel = require("gulp-babel");
var gulpConcat = require('gulp-concat');
var gulpClean = require('gulp-clean');
var gulpHeader = require('gulp-header');
var gulpRun = require('gulp-run');
var gulpJsdoc = require('gulp-jsdoc3');

var merge = require('merge-stream');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var fs = require('fs');
var path = require('path');

var runSequence = require('run-sequence');

//headers
var license = '/*\n ' + fs.readFileSync('LICENSE') + '*/\n';
var fileTitle = "\n//=======================================================" +
  "======================================================//\n\n";

//default task
gulp.task('default', ['build']);

//directory
var Directories = {
  SOURCE: "src",
  BUILD: "build",
  DESTINATION: "dist",
  TEMPLATES: "template",
  DOCUMENT: "docs",
  TEMP: "temp"
};

/**
 * clean build and compiled js
 */
gulp.task('clean', function () {
  return gulp.src([Directories.BUILD, Directories.DESTINATION])
    .pipe(gulpClean({force: true}))
    .pipe(gulp.dest(Directories.TEMP));
});

gulp.task('package', function () {
  runSequence('clean', 'copy-template', 'compile', 'build:donjon', 'test', function () {
  });
});

gulp.task('build', function () {
  runSequence('compile', 'build:donjon', 'test', function () {
  });
});

/**
 * copy template files to the build directory
 */
gulp.task('copy-template', function () {
  gulp.src(Directories.TEMPLATES + "/**")
    .pipe(gulp.dest(Directories.BUILD));
});

/**
 * combine all files into one js file and then compile es6 into es5
 */
gulp.task('compile', function () {
  return gulp.src([Directories.SOURCE + '/**/**.js'])
    .pipe(gulpBabel())
    .pipe(gulpHeader(fileTitle))
    .pipe(gulp.dest(Directories.DESTINATION));
});

/**
 * browserify and export public classes.
 */
gulp.task('build:donjon', function () {
  return browserify(Directories.DESTINATION + '/index.js', {
    standalone: 'Donjon'
  }).bundle()
    .pipe(source('donjon.js'))
    .pipe(gulpHeader(license))
    .pipe(gulp.dest(Directories.BUILD + '/js'));
});

/**
 * generate jsdoc
 */
gulp.task('doc', function (cb) {
  gulp.src([Directories.DESTINATION + '/**/*.js'], {read: false})
    .pipe(gulpJsdoc(cb))
    .pipe(gulp.dest(Directories.DOCUMENT));
});

/**
 * auto test
 */
gulp.task('test', function () {
  gulpRun('npm run test').exec();
});