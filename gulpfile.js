const gulp = require('gulp'),
    argv = require('yargs').argv,
    newer = require('gulp-newer'),
    git = require('gulp-git'),
    concat = require('gulp-concat'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    mqpacker = require('css-mqpacker'),
    rename = require('gulp-rename'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    imagemin = require('gulp-imagemin'),
    sassdoc = require('sassdoc'),
    styledown = require('gulp-styledown'),
    clean = require('gulp-clean');

// Project configuration
var autoprefixerOptions = { browsers: ['last 2 versions', '> 1%', 'Firefox ESR'] },
    sassOptions = {
        outputStyle: 'expanded',
        imagePath: 'images/',
        precision: 3,
        errLogToConsole: true
    },
    postCssOpts = [
        assets({ loadPaths: ['images/'] }),
        autoprefixer(autoprefixerOptions),
        cssnano
    ];

// CSS processing (production version)
gulp.task('css', function() {
    return gulp.src('components/**/*.scss')
        .pipe(sass(sassOptions))
        .pipe(postcss(postCssOpts))
        .pipe(concat('blaze-components.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(''));

});

// Bundle JavaScript
gulp.task('js', function() {
    return gulp.src(['lib/blaze.js', 'components/**/*.js'])
        .pipe(concat('blaze-components.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(stripdebug())
        .pipe(uglify())
        .pipe(gulp.dest(''));
});

// Generate docs with Styledown
gulp.task('docs', function(){
    return gulp.src([
        'docs/components.md',
        'components/ui/ui.md',
        'components/ui/fold-open/fold-open.md'
    ])
        .pipe(styledown({
            config: 'docs/styledown/config.md',
            filename: 'components.html'
        }))
        .pipe(gulp.dest('docs/'));
});

// Build all assets
gulp.task('build', ['css', 'js', 'docs']);