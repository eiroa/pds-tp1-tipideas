var mongoose = require('mongoose');

var IdeaStateSchema = new mongoose.Schema({
  title: String,
  description: String
});

//cb = callback
IdeaStateSchema.methods.make = function(cb,title,description) {
  this.title = title;
  this.description = description;
  this.save(cb);
};



mongoose.model('IdeaState', IdeaStateSchema);


var IdeaState = mongoose.model('IdeaState', IdeaStateSchema);

module.exports = {
  IdeaState: IdeaState
}
