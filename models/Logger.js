var mongoose = require('mongoose');

var LoggerSchema = new mongoose.Schema({
  description: String,
  date: Date,
  author: String
});


LoggerSchema.methods.createdPost = function(cb,author, date){
	this.author = author;
	this.date = date;
	this.description= author + " created a post ";
	this.save(cb);
};

mongoose.model('Logger', LoggerSchema);
