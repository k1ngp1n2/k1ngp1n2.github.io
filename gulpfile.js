let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let sass = require('gulp-sass');
let browserify = require('browserify');
let uglify = require('gulp-uglify');
const refresh = browserSync.reload;

// Компилирует sass в CSS и обновляет страницу в браузере
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});
// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {

    browserSync.init({
        // TODO переделать на исполняемый код dist
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", gulp.series('sass'));
    gulp.watch("app/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));