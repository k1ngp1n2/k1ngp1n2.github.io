const gulp = require('gulp');
// создает карту исходника для отладки
const sourcemaps = require("gulp-sourcemaps");
// преобразует js в команды для браузеров без поддержки ES-2015
const babel = require("gulp-babel");
// объединяет файлы
const concat = require("gulp-concat");
// сервер с поддержкой обновления страниц
const browserSync = require('browser-sync').create();
const refresh = browserSync.reload;
// преобразует scss в css
const sass = require('gulp-sass');
const browserify = require('browserify');
const uglify = require('gulp-uglify');

// Компилирует sass в CSS и обновляет страницу в браузере
gulp.task("sass", () => {
    // берем scss
    return gulp.src("app/scss/*.scss")
        // преобразуем в css
        .pipe(sass())
        // создаем карту исходника для отладки
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write("."))
        // сохраняем css
        .pipe(gulp.dest("app/css"))
        // обновляем страницу в браузере
        .pipe(browserSync.stream());
});
// Преобразует js в команды для браузеров без поддержки ES-2015
gulp.task("oldjs", function () {
    return gulp.src("app/src/*.js")
        // создаем карту исходника для отладки (плагины, добавляемые между init и write, должны поддерживаться sourcemaps
        .pipe(sourcemaps.init())
        // преобразуем js в команды для браузеров без поддержки ES-2015
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // соединяем все js файлы в 1
        .pipe(concat("site.js"))
        // сохраняем карту исходника для отладки
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("app/js"))
        // обновляем страницу в браузере
        .pipe(browserSync.stream());
});
// Создает статический сервер с контролем изменений в файлах scss/html
gulp.task("devserver", () => {
    browserSync.init({
        server: "./app"
    });
    // отслеживаем изменения scss файлов и отражаем их в css
    gulp.watch("app/scss/*.scss", gulp.series("sass"));
    // отслеживаем изменения js файлов и отображаем их в браузере
    gulp.watch("app/src/*.js", gulp.series("oldjs"));
    // отображаем изменение html-кода страницы в браузере
    gulp.watch("app/*.html").on("change", refresh);
});
// Запускает сервер для разработки
gulp.task("default", gulp.series("sass", "oldjs", "devserver"));

// Создает js-файлы для публикации на сервере
gulp.task("js", () => {
    return gulp.src("app/js/site.js")
        .pipe(gulp.dest("dist/js"));
});
// Создает html-файлы для публикации на сервере
gulp.task("html", () => {
    return gulp.src("app/*.html")
        .pipe(gulp.dest("dist"));
});
// Создает css-файлы для публикации на сервере
gulp.task("css", () => {
    return gulp.src("app/css/*.css")
        .pipe(gulp.dest("dist/css"));
});
// Создает файлы для публикации на сервере
gulp.task("dist", gulp.series('js', 'html', 'css'));
// Создает статический сервер с контролем изменений в файлах scss/html
gulp.task("official", () => {
    browserSync.init({
        server: "./dist"
    });
    // отображаем изменения css файлов в браузере
    gulp.watch("dist/css/*.css").on("change", refresh);
    // отображаем изменения js файлов в браузере
    gulp.watch("dist/js/*.js").on("change", refresh);
    // отображаем изменение html-кода страницы в браузере
    gulp.watch("dist/*.html").on("change", refresh);
});
// Запускает сервер для разработки
gulp.task("production", gulp.series('dist', 'official'));