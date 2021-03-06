var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var gulpIf = require('gulp-if');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var del = require('del');
var fileinclude = require('gulp-file-include');
var size = require('gulp-size');
var bs = require('browser-sync').create();
var debug = require('gulp-debug');

// config files

var tsProject = ts.createProject('./tsconfig.json');
var config = require('./config.json');

// environments

var env;

function getEnv() {
  if (env != null) {
    return;
  }

  var envKeys = Object.keys(config);
  if (envKeys.length == 0) {
    util.log('No environments found in config.json');
    process.exit(1);
  }

  var envKey = envKeys[0];
  if (typeof util.env.env == 'string') {
    if (envKeys.indexOf(util.env.env) == -1) {
      util.log(
        "Environment '" + util.env.env + "' does not exist in config.json"
      );
      process.exit(1);
    }
    envKey = util.env.env;
  }

  env = config[envKey];
  util.log("Using environment '" + envKey + "'");
}

// tasks

// Live server
gulp.task('browser-sync', function() {
  getEnv();

  bs.init({
    server: {
      baseDir: './' + env.dist,
    },
    ghostMode: false,
    notify: false,
    open: false,
  });
});

gulp.task('html', function() {
  getEnv();

  return gulp
    .src(env.html.src)
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true,
      })
    )
    .pipe(gulp.dest(env.html.outDir));
});

gulp.task('ts', function() {
  getEnv();

  return gulp
    .src(env.typescript.src)
    .pipe(gulpIf(env.typescript.sourceMaps.use, sourcemaps.init()))
    .pipe(tsProject())
    .pipe(gulpIf(env.typescript.minify, uglify()))
    .pipe(rename({ extname: env.typescript.outExt }))
    .pipe(
      gulpIf(
        env.typescript.sourceMaps.use,
        sourcemaps.write(
          env.typescript.sourceMaps.external
            ? env.typescript.sourceMaps.externalRelDir
            : null,
          env.typescript.sourceMaps.external
            ? {
                sourceMappingURLPrefix:
                  env.typescript.sourceMaps.externalURLPrefix,
              }
            : null
        )
      )
    )
    .pipe(gulp.dest(env.typescript.outDir))
    .pipe(bs.reload({ stream: true })); // prompts a reload after compilation;;
});

gulp.task('sass', function() {
  getEnv();

  return gulp
    .src(env.sass.src)
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(gulpIf(env.sass.sourceMaps.use, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulpIf(env.sass.minify, cssnano()))
    .pipe(rename({ extname: env.sass.outExt }))
    .pipe(
      gulpIf(
        env.sass.sourceMaps.use,
        sourcemaps.write(
          env.sass.sourceMaps.external
            ? env.sass.sourceMaps.externalRelDir
            : null,
          env.sass.sourceMaps.external
            ? {
                sourceMappingURLPrefix: env.sass.sourceMaps.externalURLPrefix,
              }
            : null
        )
      )
    )
    .pipe(gulp.dest(env.sass.outDir))
    .pipe(bs.reload({ stream: true })); // prompts a reload after compilation;
});

gulp.task('assets', function() {
  getEnv();

  var tasks = env.assets.map(function(assets) {
    return gulp.src(assets.src).pipe(gulp.dest(assets.outDir));
  });

  return merge(tasks);
});

gulp.task('clean', function() {
  getEnv();

  return del.sync(env.clean);
});

gulp.task('size-dist', function() {
  getEnv();
  return gulp
    .src(env.dist + '/**/*')
    .pipe(size({ showTotal: true, pretty: true }));
});

gulp.task('build', function(callback) {
  getEnv();

  runSequence('clean', 'ts', 'sass', 'assets', 'html', 'size-dist', callback);
});

gulp.task('watch', ['browser-sync'], function(callback) {
  getEnv();

  runSequence(['clean', 'ts', 'sass', 'assets', 'html'], callback);

  gulp.watch(env.typescript.src, ['ts']);
  gulp.watch(env.sass.src, ['sass']);
  gulp.watch(env.html.src, ['html']).on('change', bs.reload);
});

gulp.task('help', function() {
  util.log(`
Usage: gulp [TASK] [--env ENVIRONMENT]
Tasks:
    build         Compile TypeScript and Sass and copy assets
    watch         Watch and recompile TypeScript and Sass and copy assets and run live server
    ts            Compile TypeScript
    sass          Compile Sass
    assets        Copy assets
    html          Copy html files
    browser-sync  Run live server
    clean         Clean files
  `);
});

gulp.task('default', ['build']);
