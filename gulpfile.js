var properties = {
  port: 8080,
  folders: {
    build: 'build',
    src: 'source',
  }
}

var plugins = {
  js: [
    'bower_components/jquery/dist/jquery.min.js',
	   'source/scripts/vendor/*.js',
      'node_modules/scroll-depth/jquery.scrolldepth.js',
	  'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
    'node_modules/jquery-placeholder/jquery.placeholder.js'
  ],
  css: [
    'bower_components/normalize-scss/normalize.css',
	   'source/styles/vendor/*.css',
	   'node_modules/jquery-form-styler/dist/jquery.formstyler.css'
  ]
}

var
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer')
  babel = require('gulp-babel'),
  watch = require('gulp-watch'),
  connect = require('gulp-connect'),
  livereload = require('gulp-livereload');

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('scripts', function() {
  return gulp.src([
      properties.folders.src + '/scripts/plugins.js',
      properties.folders.src + '/scripts/app.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(babel({compact: false, presets: ['es2015']}))
    .on('error', onError)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(properties.folders.build + '/scripts'))
    .pipe(livereload());
});

gulp.task('vendor', function () {
	gulp.src(plugins.css)
	  .pipe(concat('vendor.css'))
	  .pipe(gulp.dest(properties.folders.build + '/styles/'));
	gulp.src(plugins.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(properties.folders.build + '/scripts/'));
});

gulp.task('jade', function() {
	gulp.src(properties.folders.src + '/views/*.jade')
		.pipe(jade({
			pretty: true
		}))
    .on('error', onError)
		.pipe(gulp.dest(properties.folders.build))
    .on('end', function(){
      gulp.src(properties.folders.build + '/**/*.html')
        .pipe(livereload());
    });
});

gulp.task('sass', function () {
	gulp.src(properties.folders.src + '/styles/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(properties.folders.build + '/styles'));
});

gulp.task('server', function() {
  connect.server({
    port: properties.port,
		root: properties.folders.build
	});
});

gulp.task('watch', function() {
  livereload.listen();
	watch(properties.folders.src + '/views/**/*.jade', function() {
    gulp.start('jade');
	});
	watch(properties.folders.src + '/styles/**/*.scss', function() {
    gulp.start('sass');
	});
	watch(properties.folders.src + '/scripts/**/*.js', function() {
    gulp.start('scripts');
	});
  gulp.watch(properties.folders.build + '/styles/main.css').on('change', livereload.changed);
});

gulp.task('default', ['server', 'jade', 'scripts', 'vendor', 'sass', 'watch']);
