var mongoose = require('mongoose');

var LoggerSchema = new mongoose.Schema({
  description: String,
  date: Date,
  author: String
});


LoggerSchema.methods.createdPost = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " proposed a new idea ";
	this.save(cb);
};

LoggerSchema.methods.deletedIdea = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " deleted an idea ";
	this.save(cb);
};

LoggerSchema.methods.acceptedEnrollment = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " approved an enrollment to an idea ";
	this.save(cb);
};


LoggerSchema.methods.rejectedIdea = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " rejected an idea ";
	this.save(cb);
};

LoggerSchema.methods.createdPost = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " created a post ";
	this.save(cb);
};

mongoose.model('Logger', LoggerSchema);
