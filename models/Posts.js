var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  date: Date,
  author: String,
  upvotes: {type: Number, default: 0},
  downvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

//cb = callback
PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

PostSchema.methods.downvote = function(cb) {
  this.downvotes -= 1;
  this.save(cb);
};


mongoose.model('Post', PostSchema);
