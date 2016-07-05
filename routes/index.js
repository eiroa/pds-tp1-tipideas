var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var UserRole = mongoose.model('UserRole');
var Logger = mongoose.model('Logger');


var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

require('../config/passport');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});





router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();
  var userRole = new UserRole();
  if(req.body.username == 'director'){
	userRole.title='director';
  }else{
	userRole.title='pending';
  }
  

  user.userRole = userRole;
   
  

  userRole.save(function(err){ 
 	if(err){return next(err);}
  });
   
  console.log("new role saved: " + userRole.title);
  user.username = req.body.username;
  user.setPassword(req.body.password);


  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


router.post('/login', function(req, res, next){
 console.log("executing login");
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT(),role: user.userRole.title});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


module.exports = router;
