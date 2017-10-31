'use strict';
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var fileinclude  = require('gulp-file-include');
var babel = require('gulp-babel');
//模板编辑
gulp.task('fileinclude', function() {
    gulp.src('src/**/*.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
    .pipe(gulp.dest('public'));
});

//样式
gulp.task('sass', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(cssnano())
    .pipe( gulp.dest('public'));
});
//JS编译
gulp.task('js', function() {  
    return gulp.src('src/**/*.js') 
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('public'));  
});  

gulp.task('default', function () {
	gulp.watch('src/**/*.html', ['fileinclude']);
	gulp.watch('src/**/*.scss', ['sass']);
	gulp.watch('src/**/*.js', ['js']);
});
