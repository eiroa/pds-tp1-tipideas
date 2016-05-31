/*
var gulp = require("gulp");
var inject = require("gulp-inject");
var minifier = require("gulp-htmlmin");
var jshint = require('gulp-jshint');
var reporter = require('jshint-stylish');

gulp.task("tarea1",function(){
	console.log("esto es una tarea");
});


gulp.task("tarea2",function(){
	console.log("esta es la tarea 2");
});


gulp.task("tarea3",["tarea2"],function(){
	console.log("esta es la tarea 3, que requirio que termine la tarea 2");
});

gulp.task("tareaMaster",["tarea1","tarea2","tarea3"])

gulp.task("addDependencies",function(){
	var dependencies = gulp.src("public/javascripts/** / * .js");
	gulp.src("views/index.ejs")
	.pipe(inject(dependencies))
	.pipe(minifier({collapseWhitespace:true}))
	.pipe(gulp.dest("public"));
});

gulp.task('lint',function(){
	return gulp.src(['routes/index.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(reporter));

});
*/



var gulp = require('gulp');

var mocha = require('gulp-mocha');
var wiredep = require('wiredep').stream
var protractor = require("gulp-protractor").protractor;
var webdriver_update = require('gulp-protractor').webdriver_update;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
var Server = require('karma').Server;

var inject = require('gulp-inject');




var paths = {
	views: 'views/',
	dist: 'dist/',
	src: 'public',
	index: 'views/index.ejs'
};

gulp.task('inject-vendor', function() {
	gulp.src(paths.index)
	.pipe(wiredep({}))
	.pipe(gulp.dest(paths.dist));
});

gulp.task('inject-own', function() {
	gulp.src(paths.index)
	.pipe(inject(gulp.src(paths.sources, {read: false})))
	.pipe(gulp.dest('./www'));
});



gulp.task('wiredep',function(){
	log('Wire up the bower cssjs and our app js into the html')
	var options = config.getWiredepDefaultOptions();  
	var wiredep = require('wiredep').stream;

	return gulp 
	.src('views/index.ejs')  
	.pipe(wiredep(options))
	.pipe($.inject(gulp.src(config.js)))  
	.pipe(gulp.dest(config.client));  
});


gulp.task('bower', function () {
	gulp.src('./views/index.ejs')
	.pipe(wiredep({}))
	.pipe(gulp.dest('./dist'));
});


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

gulp.task("test",["tests_backend","tests_frontend","tests_e2e"],function(done){
	done();
});