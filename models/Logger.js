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

LoggerSchema.methods.enroll = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " desires to enroll to an idea ";
	this.save(cb);
};



LoggerSchema.methods.rejectedEnroll = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " rejected an enrollment ";
	this.save(cb);
};

LoggerSchema.methods.acceptEnroll = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " accepted an enrollment ";
	this.save(cb);
};

mongoose.model('Logger', LoggerSchema);
