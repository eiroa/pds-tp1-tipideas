var mongoose = require('mongoose');
var IdeaStateSchema = require('mongoose').model('IdeaState').schema;

var IdeaSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  date: Date,
  author: String,
  ideaState: { type: mongoose.Schema.Types.ObjectId, ref: 'IdeaState'},
  upvotes: {type: Number, default: 0},
  downvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

//cb = callback
IdeaSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

IdeaSchema.methods.downvote = function(cb) {
  this.downvotes -= 1;
  this.save(cb);
};


//Turns pending to accepted  - should create a TIP entity
IdeaSchema.methods.accept = function(cb) {
  var role = new IdeaState();
  role.title = 'accepted';
  this.role = role;
  this.save(cb);
};

IdeaSchema.methods.enroll = function(cb,idea) {
  var role = new IdeaState();
  role.title = 'pending';
  idea.ideaState = role;
  console.log("enrolling");
  idea.save(cb);
};

//Turns from pending to available
IdeaSchema.methods.reject = function(cb) {
  var role = new IdeaState();
  role.title = 'available';
  this.role = role;;
  this.save(cb);
};


//Turns to deleted state
IdeaSchema.methods.delet = function(cb) {
  var role = new IdeaState();
  role.title = 'deleted';
  this.role = role;
  this.save(cb);
};


mongoose.model('Post', IdeaSchema);
