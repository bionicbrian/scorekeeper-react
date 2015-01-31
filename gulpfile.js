"use strict";

var gulp = require("gulp");
var browserify = require("browserify");
var watchify = require("watchify");
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

gulp.task("watch", function() {
    gulp.watch(paths.css, ["css"]);
});

gulp.task("default", function () {
    var b = browserify(paths.appJS);

    var w = watchify(b);

    function rebundle() {
        console.log("rebundlin'");
        w.bundle()
         .pipe(source("bundle.js"))
         .pipe(gulp.dest("build/js/"));
    }

    w.transform(to5ify).on("update", rebundle);

    return rebundle();
});
