var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var User = mongoose.model('User');
var UserRole = mongoose.model('UserRole');

var Logger = mongoose.model('Logger');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


var hf = require('./helperFunctions');

router.get('/', function(req, res, next) {

//Dame todos los usuarios, no me muestres el hash y populame el userRole
  User.find().select('-hash').populate({
      path: 'userRole'
    }).exec(function(err, users) {
      if(err){ return next(err);}
      res.json(users);
   });

});




router.post('/changeRole', auth, hf.validateDirector,function(req, res, next) {
  
  User.findById(req.body._id, function(err, user) {

      if (err) res.send(err);

        UserRole.findByIdAndRemove(user.userRole, function (err){
          if(err) { return next(err); }
      console.log("previous role deleted");
      });

        var role = new UserRole();
        role.title = req.body.value;
        user.userRole = role;
        console.log("changing role to "+role.title);
       
        role.save(function(err) {
            if (err) res.send(err);
        });
        user.save(function(err) {
            if (err) res.send(err);
        }); 
        return res.sendStatus(200);

        });

});
module.exports = router;
