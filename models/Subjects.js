var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
  title: String,
  description: String
});

//cb = callback
SubjectSchema.methods.make = function(cb,title,description) {
  this.title = title;
  this.description = description;
  this.save(cb);
};

mongoose.model('Subject', SubjectSchema);


var Subject = mongoose.model('Subject', SubjectSchema);

module.exports = {
  Subject: Subject
}
