var mongoose = require('mongoose');

var UserRoleSchema = new mongoose.Schema({
  title: String,
  description: String
});

//cb = callback
UserRoleSchema.methods.make = function(cb,title,description) {
  this.title = title;
  this.description = description;
  this.save(cb);
};



mongoose.model('UserRole', UserRoleSchema);


var UserRole = mongoose.model('UserRole', UserRoleSchema);

module.exports = {
  UserRole: UserRole
}

