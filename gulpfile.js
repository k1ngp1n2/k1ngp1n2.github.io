const gulp = require("gulp");
// создает карту исходника для отладки
const sourcemaps = require("gulp-sourcemaps");
// преобразует js в команды для браузеров без поддержки ES-2015 (преобразуемые файлы находятся в html-коде между комментариями build и endbuild)
const babel = require("gulp-babel");
// объединяет файлы
const useref = require("gulp-useref");
// сервер с поддержкой обновления страниц
const browserSync = require("browser-sync").create();
const refresh = browserSync.reload;
// преобразует scss в css
const sass = require("gulp-sass");
// Уменьшает размер JS-файла
const uglify = require("gulp-uglify");
// Используется для изменения CSS файлов
const postcss = require('gulp-postcss');
// Добавляет в CSS файлы префиксы для поддержки разных браузеров
const autoprefixer = require('autoprefixer');
// Уменьшает размер CSS-файла
const csso = require('gulp-csso');
// Уменьшает размер HTML-файла
const htmlmin = require('gulp-htmlmin');
// Включает поддержку ветвлений в gulp
const gulpIf = require("gulp-if");

// Компилирует sass в CSS и обновляет страницу в браузере
gulp.task("sass", () => {
    let plugins = [
        // добавляем префиксы для поддержки разных браузеров
        autoprefixer(),
    ];
    // берем scss
    return gulp.src("app/scss/*.scss")
        // преобразуем в css
        .pipe(sass())
        // создаем карту исходника для отладки
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
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
gulp.task("dev", gulp.series("sass", "oldjs", "devserver"));

// Создает файлы для публикации на сервере
gulp.task("dist", () => {
    // соединяем все js и css в 2 отдельных файла
    return gulp.src("app/*.html")
        .pipe(useref())
        // Уменьшаем CSS-файл
        .pipe(gulpIf("*.css", csso()))
        // Уменьшаем JS-файл
        .pipe(gulpIf("*.js", uglify()))
        // Уменьшаем HTML-файл
        .pipe(gulpIf("*.html", htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest("dist"));
});
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
gulp.task("production", gulp.series("dist", "official"));