'use strict';

const gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minify = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  maps = require('gulp-sourcemaps'),
  util = require('gulp-util'),
  babel = require('gulp-babel'),
  del = require('del');

gulp.task("compileScripts", function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task("concatScripts", ["compileScripts"], function () {
  return gulp
    .src([
      './node_modules/jquery/dist/jquery.js',
      './jquery-ui-1.12.1.custom/jquery-ui.js',
      './node_modules/tether/dist/js/tether.js',
      './node_modules/bootstrap/dist/js/bootstrap.js',
      './node_modules/fabric/dist/fabric.js',
      './node_modules/izimodal/js/iziModal.js',
      './other_modules/Blob.js',
      './other_modules/canvas-toBlob.js',
      './other_modules/file-saver/FileSaver.js',
      './dist/js/index.js',
    ])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task("minifyScripts", ["concatScripts"], function () {
  return gulp.src("./dist/js/index.js")
    .pipe(uglify())
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(rename('index.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('concatCss', function () {
  gulp.src([
    './jquery-ui-1.12.1.custom/jquery-ui.css',
    './jquery-ui-1.12.1.custom/jquery-ui.theme.css',
    "./node_modules/bootstrap/dist/css/bootstrap.css",
    "./node_modules/izimodal/css/iziModal.css",
    "./node_modules/font-awesome/css/font-awesome.css",
    './src/css/styles.css'])
    .pipe(concat('index.css'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('minifyCss', ['concatCss'], function () {
  gulp.src('./dist/css/index.css')
    .pipe(minify())
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(rename('index.min.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ["minifyScripts", "minifyCss"], function () {
  console.log("Done...");
});