var mongoose = require('mongoose');

var LoggerSchema = new mongoose.Schema({
  description: String,
  date: Date,
  author: String
});


LoggerSchema.methods.createIdea = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " proposed a new idea ";
	this.save(cb);
};

LoggerSchema.methods.deleteIdea = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " deleted an idea ";
	this.save(cb);
};

LoggerSchema.methods.enrollIdea = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " desires to enroll to an idea ";
	this.save(cb);
	console.log(" enroll log saved");
};


LoggerSchema.methods.rejectIdea= function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " rejected an enrollment ";
	this.save(cb);
};

LoggerSchema.methods.acceptIdea = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " accepted an enrollment ";
	this.save(cb);
};


LoggerSchema.methods.destroy = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " erased an idea ";
	this.save(cb);
};

LoggerSchema.methods.commentIdea = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " made a comment ";
	this.save(cb);
};

mongoose.model('Logger', LoggerSchema);



var Logger = mongoose.model('Logger', LoggerSchema);

module.exports = {
  Logger: Logger
}
