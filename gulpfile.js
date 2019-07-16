var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('release', function() {
    return gulp.src(['./lib/**', './src/**', './logo.png', './manifest.json'], {base: '.'})
        .pipe(zip('build.zip'))
        .pipe(gulp.dest('./dist'));
});