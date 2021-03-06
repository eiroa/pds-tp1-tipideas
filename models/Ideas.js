var mongoose = require('mongoose');
var IdeaState = require("../models/IdeaState").IdeaState;
var Logger = require("../models/Logger").Logger;

var IdeaSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  author: String,
  ideaState: { type: mongoose.Schema.Types.ObjectId, ref: 'IdeaState'},
  upvotes: {type: Number, default: 0},
  downvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  links: [String],
  tags:[String],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
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

IdeaSchema.methods.deleteState = function(){
  IdeaState.findByIdAndRemove(this.ideaState, function (err){
        if(err) { console.log("error deleting");return next(err); }
        console.log("deleting state ");
  });
}


//Turns pending to accepted  - should create a TIP entity
IdeaSchema.methods.accept = function(user,cb) {
  this.deleteState();

  var state = new IdeaState();
  state.title = 'accepted';
  this.ideaState = state;
  
  state.save(cb);
  
  
  var activity = new Logger(); 
        activity.acceptIdea(
            cb,
          user, 
           new Date()
         ); 
  this.save(cb);
};

//turns available to pending
IdeaSchema.methods.enroll = function(user,cb) {
  this.deleteState();

  var state = new IdeaState();
  state.title = 'pending';
  this.ideaState = state;

  state.save(cb);
  
  
  var activity = new Logger(); 
        activity.enrollIdea(
            cb,
          user, 
           new Date()
         ); 
  this.save(cb);
};

//Turns from pending to available
IdeaSchema.methods.reject = function(user,cb) {
  this.deleteState();

  var state = new IdeaState();
  state.title = 'available';
  this.ideaState = state;
  
  state.save(cb);
  
  
  var activity = new Logger(); 
        activity.rejectIdea(
            cb,
          user, 
           new Date()
         ); 
  this.save(cb);
};


//Turns to deleted state
IdeaSchema.methods.delet = function(user,cb) {
  this.deleteState();

  var state = new IdeaState();
  state.title = 'deleted';
  this.ideaState = state;
  
  state.save(cb);
  
  var activity = new Logger(); 
        activity.deleteIdea(
            cb,
          user, 
           new Date()
         ); 
  this.save(cb);
};


mongoose.model('Idea', IdeaSchema);


var Idea = mongoose.model('Idea', Idea);

module.exports = {
  Idea: Idea
}

