"use strict"
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');
var UserRole = mongoose.model('UserRole');
var Logger = mongoose.model('Logger');
var Subject = mongoose.model('Subject');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var hf = require('./helperFunctions');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});



router.get('/', function(req, res, next) {
// solo dame las materias
  Subject.find({},function(err, subs){
    if(err){ 
  return next(err);
    }
  res.json(subs);
  });

});


router.post('/create', auth, hf.validateDirector, function(req, res, next) {
  var subject = new Subject();
  subject.title = req.body.title;
  subject.description = req.body.description;

  subject.save(function(err, comment){
    if(err){ return next(err); }
  res.sendStatus(200);
  });

});

router.post('/edit', auth, hf.validateDirector, function(req, res, next) {

  Subject.findById(req.body._id, function(err, subject) {

      if (err) res.send(err);
        subject.title = req.body.title;
          subject.description = req.body.description;
      
        subject.save(function(err) {
            if (err) res.send(err);
        }); 
        return res.sendStatus(200);

        });

});

router.post('/delete', auth, hf.validateDirector, function(req, res, next) {
  Subject.findByIdAndRemove(req.body._id, function (err){
      if(err) { return next(err); }
  res.sendStatus(200);
  });
  
});

module.exports = router;
