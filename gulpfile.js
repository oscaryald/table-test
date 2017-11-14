
// npm install gulp --save-dev
var gulp = require('gulp'); // Require gulp

// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// // Other dependencies
var browserSync = require('browser-sync').create(); // Reload the browser on file changes

var gulpSequence = require('gulp-sequence');
var newer = require('gulp-newer');
var clean = require('gulp-clean');

// // Tasks -------------------------------------------------------------------- >
// // Task to compile Sass file into CSS, and minify CSS into build directory
gulp.task('styles', function() {
  gulp.src('./sourse/sass/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./sourse/css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('assets', function(){
   return gulp.src('sourse/**')
    .pipe(newer('build'))
    .pipe(gulp.dest('build'));
});

gulp.task('cleanAll', function(){
   return gulp.src('build/*', {read: false})
        .pipe(clean()); 
});

gulp.task('build', gulpSequence('cleanAll', ['assets', 'styles']));

// // Serve application
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: 'sourse',
    },
  });
});

// // Run all Gulp tasks and serve application
gulp.task('dev', ['build', 'serve'], function() {
  gulp.watch('sourse/sass/*.scss', ['styles']);
  gulp.watch('sourse/*.html', browserSync.reload);
  gulp.watch('sourse/js/*.js', browserSync.reload);
  gulp.watch('sourse/**/*.*', ['assets']);
});


