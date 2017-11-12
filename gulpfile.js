
// npm install gulp --save-dev

var gulp = require('gulp'); // Require gulp

// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// var imagemin = require('gulp-imagemin'); // Minify images

// // Other dependencies
// var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync').create(); // Reload the browser on file changes

var gulpSequence = require('gulp-sequence');
var newer = require('gulp-newer');

var clean = require('gulp-clean');

// // Tasks -------------------------------------------------------------------- >

// // Task to compile Sass file into CSS, and minify CSS into build directory
gulp.task('styles', function() {
  gulp.src('./source/sass/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./source/css'))
    // .pipe(minifyCSS())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

// // Task to minify images into build
// gulp.task('images', function() {
//   gulp.src('./source/img/*')
//   .pipe(imagemin({
//     progressive: true,
//   }))
//   .pipe(gulp.dest('./build/img'));
// });

// // Task to get the size of the app project
// gulp.task('size', function() {
//   gulp.src('./source/**')
//     .pipe(size({
//     showFiles: true,
//   }));
// });

// // Task to get the size of the build project
// gulp.task('build-size', function() {
//   gulp.src('./build/**')
//   .pipe(size({
//     showFiles: true,
//   }));
// });

gulp.task('assets', function(){
   return gulp.src('source/**')
    .pipe(newer('build'))
    .on('data', function(file){
      console.log(file)
    })
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
      baseDir: './sourse',
    },
  });
});


// // Run all Gulp tasks and serve application
gulp.task('dev', ['serve', 'build'], function() {
  gulp.watch('sourse/sass/*.scss', ['styles']);
  gulp.watch('sourse/*.html', browserSync.reload);
  gulp.watch('sourse/js/*.js', browserSync.reload);
  gulp.watch('sourse/**/*.*', ['assets']);
});
