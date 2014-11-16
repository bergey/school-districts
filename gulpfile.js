/* global require */

"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var ghPages = require("gulp-gh-pages");
var del = require("del");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");

var watchOrBrowserify = function(watch) { // false for distribution, true for dev
    return function() {
        var bundler = browserify({
            cache: {},
            packageCache: {},
            fullPaths: true,
            entries: ["./js/main.js"],
            debug: true,
            outputName: "js/school-districts.js"
        });

        // Optionally, you can apply transforms
        // and other configuration options on the
        // bundler just as you would with browserify
        // bundler.transform("brfs");

        function rebundle() {
            return bundler.bundle()
            // log errors if they happen
                .on("error", gutil.log.bind(gutil, "Browserify Error"))
                .pipe(source("js/school-districts.js"))
                .pipe(gulp.dest("./"));
        }

        if (watch) {
            bundler = watchify(bundler);
            bundler.on("update", rebundle);
        }

        return rebundle();
    };
};

// synonym for watchify, until I have CSS or something to compile
gulp.task("watch", ["watchify"]);

gulp.task("browserify", watchOrBrowserify(false));

gulp.task("watchify", watchOrBrowserify(true));

gulp.task("clean", function(cb) {
    // delete everything under dist/ but leave the directory
    del("dist/?**", cb);
});

gulp.task("dist", ["clean", "browserify"], function() {
    gulp.src("index.html").pipe(gulp.dest("dist"));
    gulp.src("css/*.css").pipe(gulp.dest("dist/css"));
    gulp.src("data/*").pipe(gulp.dest("dist/data"));
    gulp.src("js/school-districts.js").pipe(gulp.dest("dist/js"));
});

gulp.task("gh-pages", ["dist"], function() {
    return gulp.src("dist/**/*")
        .pipe(ghPages());
});
