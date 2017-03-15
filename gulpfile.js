/**
 * Required plugins
 */
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cache = require('gulp-cache');
const del = require('del');
const runSequence = require('run-sequence');
const inject = require('gulp-inject');
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
    userefUglify(config.app);
});

function userefUglify(cfg){
    return gulp.src(cfg.html.src)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'))
}

/**
 * Clean production envirnomnet
 */
gulp.task('clean:dist', function() {
    return del.sync('dist');
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
function copyAssetsFolder(cfg){
    return gulp.src(cfg.assets.src)
        .pipe(gulp.dest(cfg.assets.dest));
}

gulp.task('copy-assets-folder', function(){
    copyAssetsFolder(config.app);
});

/**
 * Build task for production environment
 */
gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['copy-assets-folder', 'useref'],
        callback
    );
});

gulp.task('new-build', gulp.series('clean:dist', gulp.parallel('copy-assets-folder', 'useref')));

gulp.task('default', gulp.series(gulp.parallel('index', 'lint'), 'browserSync', 'watch'));
