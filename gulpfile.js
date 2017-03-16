/**
 * Required plugins
 */
const gulp = require('gulp');
const gulpif = require('gulp-if');
const cache = require('gulp-cache');
const clean = require('gulp-clean');
const jshint = require('gulp-jshint');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const inject = require('gulp-inject');
const browserSync = require('browser-sync').create();
const config = require('./config.json');

/**
 * Inject javascript file references to index.html file
 */
gulp.task('index', function () {
    return gulp.src('./app/index.html')
        .pipe(inject(gulp.src(['./app/js/vendor/three.min.js','./app/js/vendor/**/*.js'], {read: false}), {relative: true}))
        .pipe(gulp.dest('app/'));
});

/**
 * Check javascript for syntax errors
 */
gulp.task('lint', function() {
    return gulp.src('./app/js/**/*.js')
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter('default', { verbose: true }));
});

/**
 * Watch project files and reload the screen
 */
function watchAll(cfg){
    // Reloads the browser whenever HTML or JS files change
    gulp.watch(cfg.html.src, browserSync.reload);
    gulp.watch(cfg.js.src, ['lint', browserSync.reload]);  
}

gulp.task('watch', function (){
    watchAll(config.app); 
});

/**
 * Automatic Browser reload
 */
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
          baseDir: 'app'
        },
    })
});


/**
 * JS concatenation and minification
 */
gulp.task('useref', function(){
    return gulp.src(config.app.html.src)
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});

gulp.task('minifyJs', function() {
    return gulp.src('dist/js/main.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

/**
 * Clean production dist folder
 */
gulp.task('clean:dist', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

/**
 * Cache clear task
 */
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

/**
 * Copy the required src folders to the dist folder
 */
gulp.task('copy-assets-folder', function(){
    return gulp.src(config.app.assets.src)
        .pipe(gulp.dest(config.app.assets.dest));
});

/**
 * Default task for development environment
 */
gulp.task('default', gulp.series(gulp.parallel('index', 'lint'), 'browserSync', 'watch'));

/**
 * Build task for production environment
 */
gulp.task('build', gulp.series('clean:dist', gulp.parallel('copy-assets-folder', 'useref'), 'minifyJs'));
