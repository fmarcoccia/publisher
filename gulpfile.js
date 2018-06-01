const gulp = require('gulp');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;


gulp.task('build', ()=>{

  return gulp.src("index.js")
    .pipe(rename("bundle.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/"));

});