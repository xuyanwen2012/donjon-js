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
var dirs = {
  src: "src",
  dest: "js"
};

/**
 * clean build and compiled js
 */
gulp.task('clean', function () {
  return gulp.src(['build','js'])
    .pipe(gulpClean({force: true}))
    .pipe(gulp.dest('temp'));
});

gulp.task('package', function () {
  runSequence('clean','copy-template','compile', 'build:donjon', 'test', function () {});
});

gulp.task('build', function () {
  runSequence('compile', 'build:donjon', 'test', function () {
    // gulpRun('npm run test').exec();
  });
});

/**
 * copy template files to the build directory
 */
gulp.task('copy-template',function () {
  gulp.src('template/**')
    .pipe(gulp.dest('build'));
});

/**
 * combine all files into one js file and then compile es6 into es5
 */
gulp.task('compile', function () {
  return gulp.src(['src/**/**.js'])
    .pipe(gulpBabel())
    .pipe(gulpHeader(fileTitle))
    .pipe(gulp.dest(dirs.dest));
});

/**
 * browserify and export public classes.
 */
gulp.task('build:donjon', function () {
  return browserify('js/index.js', {
    standalone: 'Donjon'
  }).bundle()
    .pipe(source('donjon.js'))
    .pipe(gulpHeader(license))
    .pipe(gulp.dest('./build/js'));
});

/**
 * generate jsdoc
 */
gulp.task('doc', function (cb) {
  gulp.src(['./js/**/*.js'], {read: false})
    .pipe(gulpJsdoc(cb))
    .pipe(gulp.dest('./docs'));
});

/**
 * auto test
 */
gulp.task('test', function () {
  gulpRun('npm run test').exec();
});