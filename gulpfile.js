"use strict";

var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var stylus = require("gulp-stylus");
var to5ify = require("6to5ify");

var paths = {
    css: "src/style/**/*.styl",
    appJS: "./src/js/main.js",
    js: "src/js/**/*.js"
};

gulp.task("css", function () {
    return gulp.src(paths.css)
        .pipe(stylus())
        .pipe(gulp.dest("build/css"));
});

gulp.task("js", function () {
    browserify(paths.appJS)
        .transform(to5ify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("build/js/"));
});

gulp.task("watch", function() {
    gulp.watch(paths.css, ["css"]);
    gulp.watch(paths.js, ["js"]);
});

gulp.task("default", ["watch", "css", "js"]);
