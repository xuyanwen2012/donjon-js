var gulp = require('gulp');
var gulpBabel = require("gulp-babel");
var gulpConcat = require('gulp-concat');

var merge = require('merge-stream');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var fs = require('fs');
var path = require('path');

var Server = require('karma').Server;

gulp.task('default', ['build']);

var dirs = {
  src:"src",
  dest:"js"
};

/**
 * @param dir
 * @returns {Array}
 */
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

/**
 * combine all files into one js file and then compile es6 into es5
 */
gulp.task('build', function () {
  return gulp.src('src/**/**.js')
    .pipe(gulpBabel())
    .pipe(gulp.dest(dirs.dest));
});

/**
 * browserify app to client
 */
gulp.task('browserify', function () {
  return browserify([
    'js/main.js'
  ])
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});