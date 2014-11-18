/* global require, console */

"use strict";

var filter = require("gulp-filter");
var browserSync = require("browser-sync");
var browserify = require("browserify");
var del = require("del");
var ghPages = require("gulp-gh-pages");
var gulp = require("gulp");
var gutil = require("gulp-util");
var runSequence = require("run-sequence");
var sass = require("gulp-ruby-sass");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");
var watchify = require("watchify");

var prefix = "school-districts/"; // mimic path on gh-pages
var dist = "dist/" + prefix;
var build = "build/" + prefix;
var jsBuilt = build + "js/school-districts.js";

var watchOrBrowserify = function(watch) { // false for distribution, true for dev
    return function() {

        var bundler = browserify({
            cache: {},
            packageCache: {},
            fullPaths: true,
            entries: ["./js/main.js"],
            debug: watch,
            outputName: jsBuilt
        });

        // Optionally, you can apply transforms
        // and other configuration options on the
        // bundler just as you would with browserify
        // bundler.transform("brfs");

        function rebundle() {
            var ret = bundler.bundle()
            // log errors if they happen
                .on("error", gutil.log.bind(gutil, "Browserify Error"))
                .pipe(source(jsBuilt))
                .pipe(gulp.dest("./"));
            if (watch) {
                return ret.pipe(browserSync.reload({stream: true}));
            } else {
                return ret;
            }
        }

        if (watch) {
            bundler = watchify(bundler);
            bundler.on("update", rebundle);
        }
        // regardless of `watch`, this is a stream
        return rebundle();
    };
};

gulp.task("browserify", watchOrBrowserify(false));

gulp.task("jsDist", ["browserify"], function() {
    gulp.src(jsBuilt)
        .pipe(uglify())
        .pipe(gulp.dest(dist + "js"));
});

gulp.task("watchify", watchOrBrowserify(true));

// watch js, css, and simple copy tasks
gulp.task(
    "watch",
    ["watchify", "browser-sync", "css", "htmlBuild", "copy"],
    function() {
        gulp.watch("css/**/*", ["css"]);
        gulp.watch("html/**/*", ["htmlBuild"]);
        gulp.watch("data/**/*", ["copy"]);
    });

gulp.task("cleanDist", function(cb) {
    // delete everything under dist/ but leave the directory
    del("dist/?**", cb);
});

gulp.task("cleanBuild", function(cb) {
    // delete everything under dist/ but leave the directory
    del("build/?**", cb);
});

gulp.task("clean", ["cleanBuild", "cleanDist"]);

gulp.task("css", function() {
    return gulp.src("css/*.scss")
    .pipe(sass({sourcemap: true, sourcemapPath: "../scss"}))
    .on("error",function(err) {
        console.log(err.message);
    })
        .pipe(gulp.dest(build + "css/"))
        .pipe(filter("**/*.css"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("cssDist", ["css"], function() {
    gulp.src(build + "css/**/*").pipe(gulp.dest(dist + "css/"));
});

gulp.task("htmlBuild", function() {
    gulp.src("html/**/*").pipe(gulp.dest(build));
});

gulp.task("htmlDist", function() {
    gulp.src("html/**/*").pipe(gulp.dest(dist));
});

gulp.task("gh-pages", ["dist"], function() {
    return gulp.src(dist + "**/*")
        .pipe(ghPages());
});

gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "./build",
        },
        browser: "chromium",
        startPath: prefix
    });
});

gulp.task("copy", function() {
    gulp.src("data/**/*").pipe(gulp.dest(build + "data/"));
    gulp.src("data/**/*").pipe(gulp.dest(dist + "data/"));
});

gulp.task("dist", function(cb) {
    runSequence(
        "clean",
        ["htmlDist", "jsDist", "cssDist", "copy"],
        cb);
});

gulp.task("default", ["watch"]);
