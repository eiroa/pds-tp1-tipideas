var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase:true,unique:true},
  hash: String,
  userRole: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole'}
});


UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
   console.log('attempting authentication');
  return jwt.sign({
    
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

UserSchema.methods.setPassword = function(password){
  try{
	console.log("trying to encode password: "+password);

	this.hash =crypto.createHash('sha256').update(password).digest('base64');
         
         console.log('hash is: '+this.hash);

   }catch(e){
	console.log(e);
	throw e;
   }
  
};

UserSchema.methods.validPassword = function(password) {

  return this.hash === crypto.createHash('sha256').update(password).digest('base64');
};


mongoose.model('User', UserSchema);
