var gulp = require("gulp");
var inject = require("gulp-inject");
var minifier = require("gulp-htmlmin")

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
	var dependencies = gulp.src("public/javascripts/**/*.js");
	gulp.src("views/index.ejs")
	.pipe(inject(dependencies))
	.pipe(minifier({collapseWhitespace:true}))
	.pipe(gulp.dest("public"));
});
