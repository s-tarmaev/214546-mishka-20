const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");

// Styles

const styles = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
};

exports.default = gulp.series(styles, server, watcher);

// Imagemin

// const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}").pipe(
    imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ quality: 90, progressive: true }),
      imagemin.svgo({
        plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
      }),
    ])
  );
};
exports.images = images;

// WebP

// const gulp = require("gulp");
const webp = require("gulp-webp");
const createWebp = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"));
};
exports.webp = createWebp;

// Sprites

// const gulp = require("gulp");
// const rename = require("rename");
const svgstore = require("gulp-svgstore");
const sprite = () => {
  return gulp
    .src([
      "source/img/**/icon-*.svg",
      "source/img/logo-footer.svg",
      "source/img/logo-htmlacademy.svg",
    ])
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};
exports.sprite = sprite;

// Copy

const copy = () => {
  return gulp
    .src(
      [
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**",
        "source/*.ico",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
};
exports.copy = copy;

// Clean

// const gulp = require("gulp");
const del = require("del");
const clean = () => {
  return del("build");
};
exports.clean = clean;

// Build
// const gulp = require("gulp");

const build = gulp.series(clean, copy, styles, images, createWebp, sprite);
exports.build = build;
