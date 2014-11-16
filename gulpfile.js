/* global require */

"use strict";

var gulp = require("gulp");
var rjs = require("gulp-requirejs");
var bowerRequireJS = require("bower-requirejs");
var uglify = require("gulp-uglify");
var ghPages = require("gulp-gh-pages");
var del = require("del");

gulp.task("requirejs", ["clean"], function() {
    rjs({
        baseUrl: "js",
        mainConfigFile: "js/rjs.js",
        // baseUrl: "js/rjs.js",
        out: "js/rjs.js",
        name: "sdp/main",
    })
        // .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task("copy", ["clean"], function() {
    gulp.src("index.html").pipe(gulp.dest("dist"));
    gulp.src("css/*.css").pipe(gulp.dest("dist/css"));
    gulp.src("data/*").pipe(gulp.dest("dist/data"));
});

gulp.task("bower", function() {
    bowerRequireJS({
        baseUrl: "js",
        config: "js/rjs.js",
        transitive: true
    });
});

gulp.task("clean", function(cb) {
    del("dist/**", cb);
    // cb(null); // null signals completion without error
});

gulp.task("dist", ["copy", "requirejs"]);

gulp.task("gh-pages", ["dist"], function() {
    return gulp.src("dist/**/*")
        .pipe(ghPages());
});
