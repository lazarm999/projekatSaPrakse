var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
 
gulp.task('concat', function () {
  return gulp.src('src/css/*.css')
    .pipe(concatCss("app.global.css"))
    .pipe(gulp.dest('src/css/dest/'));
});