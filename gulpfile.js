/**

Gulp Boilerplate

*/

/**
 * Required plugins
 */
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cache = require('gulp-cache');
const del = require('del');
const runSequence = require('run-sequence');
const cleanCSS = require('gulp-clean-css');
const inject = require('gulp-inject');
const config = require('./config.json');

/**
 * Inject javascript file references to index.html file
 */
gulp.task('index', function () {
    // var target = gulp.src('app/index.html');
    // var sources = gulp.src(['./app/js/vendor/three.min.js/','./app/js/vendor/**/*.js'], {read: false});

    // return target.pipe(inject(sources)).pipe(gulp.dest('app/'));

    gulp.src('./app/index.html')
        // .pipe(inject(gulp.src('./app/**/*.js', {read: false}), {relative: true}))
        .pipe(inject(gulp.src(['./app/js/vendor/three.min.js/','./app/js/vendor/**/*.js'], {read: false}), {relative: true}))
        .pipe(gulp.dest('app/'));
});


/**
 * Check javascript for syntax errors
 */
gulp.task('lint', function() {
    return gulp.src('./app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});

/**
 * Compile SASS into CSS
 */
function compileSass(cfg) {
    return gulp.src(cfg.sass.src)
        .pipe(sass())
        .pipe(gulp.dest(cfg.css.dest))
        .pipe(browserSync.reload({stream: true}));
}

gulp.task('sass', function() {
    compileSass(config.app);
});

/**
 * Watch project files and reload the screen
 */
function watchAll(cfg){
    gulp.watch(cfg.sass.src, ['sass']);
    gulp.watch(cfg.js.src, ['lint']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch(cfg.html.src, browserSync.reload);
    gulp.watch(cfg.js.src, browserSync.reload);  
}

gulp.task('watch', function (){
    watchAll(config.app); 
});

/**
 * Default taks for the Development Environment
 */
gulp.task('default', function (callback) {
    runSequence(['index', 'sass', 'lint', 'browserSync', 'watch'],
        callback
    );
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
 * JS and CSS concatenation and minification
*/
gulp.task('useref', function(){
    userefUglify(config.app);
});

function userefUglify(cfg){
    return gulp.src(cfg.html.src)
        .pipe(useref())
        // Minifies only if it's a JavaScript file
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
 * Minify CSS files
 */
function minifyCss(cfg) {
    return gulp.src(cfg.css.src)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(cfg.css.dest));
}

gulp.task('minify-css', function(){
    minifyCss(config.app);
});

/**
 * Copy the images folder to the dist folder
 */
function copyImagesFolder(cfg){
    return gulp.src(cfg.images.src)
        .pipe(gulp.dest(cfg.images.dest));
}

gulp.task('copy-images-folder', function(){
    copyImagesFolder(config.app);
});

/**
 * Build task for production environment
 */
gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'minify-css', 'copy-images-folder', 'useref'],
        callback
    )
});
