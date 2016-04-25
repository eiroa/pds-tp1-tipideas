var mongoose = require('mongoose');
//var IdeaStateSchema = require('mongoose').model('IdeaState').schema;

var TipSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  idea: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}, 
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});





mongoose.model('Tip', TipSchema);
