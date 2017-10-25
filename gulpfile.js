var gulp = require('gulp');
var gulpBabel = require("gulp-babel");
var gulpConcat = require('gulp-concat');
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

gulp.task('build', function () {
  runSequence('compile', 'build:donjon', function () {
    gulpRun('npm run test').exec();
  });
});


/**
 * combine all files into one js file and then compile es6 into es5
 */
gulp.task('compile', function () {
  return gulp.src(['src/**/**.js', '!src/libs/**'])
    .pipe(gulpBabel())
    .pipe(gulpHeader(fileTitle))
    .pipe(gulp.dest(dirs.dest));
});

/**
 * browserify and export public classes.
 */
gulp.task('build:donjon', function () {
  var b = browserify('js/index.js', {
    standalone: 'Donjon'
  }).bundle()
    .pipe(source('donjon.js'))
    .pipe(gulpHeader(license))
    .pipe(gulp.dest('./build/'));

  var c = gulp.src('src/libs/*.js')
    .pipe(gulp.dest('./build/libs'));

  return merge(b, c);
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