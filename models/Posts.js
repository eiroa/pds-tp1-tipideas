var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  date: Date,
  author: String,
  pending: {type: Boolean, default: true},
  accepted: {type: Boolean, default: false},
  rejected: {type: Boolean, default: false},
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

PostSchema.methods.accept = function(cb) {
  this.accepted = true;
  this.pending = false;
  this.save(cb);
};

PostSchema.methods.reject = function(cb) {
  this.rejected = true;
  this.pending = false;
  this.save(cb);
};


mongoose.model('Post', PostSchema);
