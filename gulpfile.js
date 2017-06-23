'use strict'
const gulp = require('gulp'),
    run = require('gulp-run'),
    spawn = require("gulp-spawn"),
    plumber = require('gulp-plumber'), // Handles errors and stuff
    notify = require("gulp-notify"); // Sends native notifications




gulp.task('test', () => {

    gulp.src("spec/autosave-onchange-spec.js", { buffer: false })
        // Handling errors sent by tests that would close watch command
        .pipe(plumber())
        // Defining command to be ran
        .pipe(spawn({
            cmd: "atom",
            args: [
                "--test",
                "spec/autosave-onchange-spec.js"
            ],
        }));
});


gulp.task('test:watch', ['test'], () => {
    gulp.watch([
        'lib/**/*.js', 'spec/**/*.js'
    ], ['test']);
});

gulp.task('default', ['test:watch']);

gulp.src("../test/fixtures/*");
