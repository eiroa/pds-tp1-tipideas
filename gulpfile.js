
var gulp = require('gulp');

var mocha = require('gulp-mocha');
var wiredep = require('wiredep').stream
var protractor = require("gulp-protractor").protractor;
var concat = require("gulp-concat");
var minifier = require("gulp-htmlmin");
var minify = require('gulp-minify');
var jshint = require('gulp-jshint');
var reporter = require('jshint-stylish');
var webdriver_update = require('gulp-protractor').webdriver_update;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
var Server = require('karma').Server;
var mainBowerFiles = require('gulp-main-bower-files');
var order = require('stream-series');
var gulpBowerFiles = require('gulp-bower-files');
var bower = require('main-bower-files');
var concatCss = require('gulp-concat-css');
var flatten = require('gulp-flatten');
const gulpFilter = require('gulp-filter');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var inject = require('gulp-inject');


gulp.task('lint', function() {
    return gulp.src('*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(reporter));
});

gulp.task("addDependencies",function(){
	var dependencies = gulp.src("public/javascripts/**/* .js");
	gulp.src("views/index.ejs")
	.pipe(inject(dependencies))
	.pipe(minifier({collapseWhitespace:true}))
	.pipe(gulp.dest("public"));
});

var srcs = {
    libJs:["public/javascripts/vendor/js/*min.js"],
    libCss:["public/javascripts/vendor/css/*.css"],
	fonts:["public/javascripts/vendor/fonts/*.*"],
    locals: ["public/javascripts/app_core.js", "public/javascripts/controllers/*.js", "public/javascripts/services/*.js"],
    js: ["public/javascripts/local/local.js"]
};





gulp.task("inject-dependencies", ["publish-components"], function() {
    var libJs = gulp.src(srcs.libJs, {read: false});
    var libCss = gulp.src(srcs.libCss, {read: false});
	var fonts = gulp.src(srcs.fonts, {read: false});
    var localFiles = gulp.src(srcs.js, {read: false});
    //by using series, it is possible to set an order in this injection
    return gulp.src("views/index.ejs")
        .pipe( inject( (order(libCss,libJs,fonts, localFiles)), { ignorePath: 'public', addRootSlash: false}))
        .pipe(gulp.dest("public"))
});



// Define paths variables
var dest_path =  'public/javascripts/vendor';
// grab libraries files from bower_components, minify and push in /public
gulp.task('publish-js', function() {

        const jsFilter = gulpFilter('**/*.js', {restore: true});

        return gulp.src(bower())

        // grab vendor js files from bower_components, minify and push in /public
        .pipe(jsFilter)
        .pipe(concat('vendor.js'))
        .pipe(minify())
        .pipe(gulp.dest( dest_path+ '/js'))

});

gulp.task('publish-local-js', function() {

		var localFiles = gulp.src(srcs.locals, {read: false});
        return gulp.src("public/javascripts/src/**/*.js")

        // grab vendor js files from bower_components, minify and push in /public
        .pipe(concat('local.js'))
		.pipe(minify())
        .pipe(gulp.dest( 'public/javascripts/local'))

});
gulp.task('publish-css', function() {

        const cssFilter = gulpFilter('**/*.css', {restore: true});

        return gulp.src(bower({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/css/bootstrap.css',
                        './dist/css/bootstrap-theme.css',
                    ]
                },
                "ng-tags-input": {
                    main: [
                        '*.min.*',
                    ]
                }
            }
        }))
        .pipe(cssFilter)
        .pipe(concatCss('vendor.css'))
        .pipe(gulp.dest( dest_path+ '/css'))

});

gulp.task('publish-less', function() {

        const lessFilter = gulpFilter('**/*.less', {restore: true});

        return gulp.src(bower())
        .pipe(lessFilter)
        .pipe(concat('vendor.less'))
        .pipe(gulp.dest( dest_path+ '/less'));

});

gulp.task('publish-fonts', function() {

        const fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'], {restore: true});

        return gulp.src(bower({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/fonts/*.*'
                    ]
                }
            }
        }))
        .pipe(gulpFilter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe(gulp.dest( dest_path+ '/fonts'));

});

gulp.task("publish-components", ["publish-js","publish-css","publish-local-js"]);

gulp.task("make", ["inject-dependencies"]);

gulp.task('tests_backend',function(){
	return gulp.src('./tests/backend/*.js',{read:false})
	.pipe(mocha({reporter:'nyan'}))
	.once('error', function () {
		process.exit(1);
	})
	.once('end', function () {
		process.exit();
	});;
});


gulp.task('webdriver_update', webdriver_update);

gulp.task('tests_e2e', ['webdriver_update'], function(cb) {
	gulp.src(['./tests/e2e/*.js']).pipe(protractor({
		configFile: 'protractor.conf.js',
	})).once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });        
});

gulp.task('tests_frontend', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task("tests_backAndFront",["tests_backend","tests_frontend"]);

gulp.task("test",["tests_backend","tests_frontend","tests_e2e"]);

gulp.task('default', ['lint', 'make','tests_backAndFront']);