"use strict"
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var Idea = mongoose.model('Idea');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var UserRole = mongoose.model('UserRole');
var IdeaState = mongoose.model('IdeaState');
var Logger = mongoose.model('Logger');
var Subject = mongoose.model('Subject');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var hf = require('./helperFunctions');



router.param('idea', function(req, res, next, id) {
  var query = Idea.findById(id);

  query.exec(function (err, idea){
    if (err) { return next(err); }
    if (!idea) { return next(new Error('Unable to find idea')); }

    req.idea = idea;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('Unable to find comment')); }

    req.comment = comment;
    return next();
  });
});

router.get('/', function(req, res, next) {
console.log("trying to get ideas with state: "+ req.query.type);
 
 

//nota mental: hacer un join en Mongo es un infierno
// Pesimo manejo de collecciones


//Dame las ideas, populame el estado, devolve las que coincidan con el estado X, y luego popula las materias

  Idea.find().populate({
      path: 'ideaState',
      match: {
        title: req.query.type
      }
    }).populate('subjects').exec(function(err, ideas) {
      ideas = ideas.filter(function(idea) {
        
         return idea.ideaState; // return only ideas with parameter idea state    
      });
      res.json(ideas);
   });



});


router.get('/:idea', function(req, res) {
  req.idea.populate('comments', function(err, idea) {
    if (err) { return next(err); }
    res.json(req.idea);
  });
});


router.post('/', auth, hf.validateProfessor,function(req, res, next) {
  var idea = new Idea(req.body); //atencion, la lista de ids de materias viene tambien
  idea.author = req.payload.username;

  console.log("subjects:received "+ idea.subjects);
   
  var ideaState = new IdeaState();
  ideaState.make(function(err){
        if(err){ return next(err); }
  },
  'available',
  'This idea is available to be taken')

  idea.ideaState = ideaState;
  
  idea.save(function(err, idea){
    if(err){ return next(err); }

    var activity = new Logger(); 
    activity.createIdea(
        function(err){
        if(err){ return next(err); }
  },
  req.payload.username, 
  new Date()
    ); 
    console.log('saving new idea: '+idea.title+ ' '+ idea.author+  '  in state:'+ idea.ideaState.title  )
    res.json(idea);
  });

   
});


router.post('/:idea/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.idea = req.idea;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.idea.comments.push(comment);
      req.idea.save(function(err, idea) {
          if(err){ return next(err); }

          var activity = new Logger(); 
          activity.commentIdea(
            function(err){
              if(err){ return next(err); }
            },
            req.idea.author, 
            new Date()
            ); 

          res.json(comment);
      });
  });

});



router.post('/enroll/:idea', auth, hf.validateStudent, function(req, res, next) {
       console.log("enrolling idea-> "+req.idea.author+ " " + req.idea.title);

         Idea.findById(req.idea._id, function(err, idea) {

            if (err) res.send(err);

            IdeaState.findByIdAndRemove(idea.ideaState, function (err){
        if(err) { return next(err); }
    console.log("available state deleted");
    });

      var state = new IdeaState();
      state.title = 'pending';
      idea.ideaState = state;
      console.log("enrolling");
     
            state.save(function(err) {
                if (err) res.send(err);
            });
            
            idea.save(function(err) {
                if (err) res.send(err);
            });

        });

  var activity = new Logger(); 
        console.log("trying to save log for enroll");
        activity.enrollIdea(
          function(err){
          if(err){ return next(err); }
    },
    req.idea.author, 
    new Date()
        ); 
  res.sendStatus(200);
});


router.post('/reject/:idea', auth, hf.validateDirector, function(req, res, next) {
  Idea.findById(req.idea._id, function(err, idea) {

            if (err) res.send(err);

      IdeaState.findByIdAndRemove(idea.ideaState, function (err){
        if(err) { return next(err); }
    console.log("pending state deleted");
    });

      var state = new IdeaState();
      state.title = 'available';
      idea.ideaState = state;
      console.log("rejecting...");
     
            state.save(function(err) {
                if (err) res.send(err);
            });
            // 
            idea.save(function(err) {
                if (err) res.send(err);
            });
            console.log("idea rejected");

        });

  var activity = new Logger(); 
        console.log("trying to save log for reject");
        activity.rejectIdea(
          function(err){
          if(err){ return next(err); }
    },
    req.idea.author, 
    new Date()
        ); 
  res.sendStatus(200);
});

router.post('/delete/:idea', auth, hf.validateDirector,function(req, res, next) {

         Idea.findById(req.idea._id, function(err, idea) {

            if (err) res.send(err);

            IdeaState.findByIdAndRemove(idea.ideaState, function (err){
        if(err) { return next(err); }
    console.log("available state deleted");
    });

      var state = new IdeaState();
      state.title = 'deleted';
      idea.ideaState = state;
      console.log("enrolling");
     
            state.save(function(err) {
                if (err) res.send(err);
            });
            
            idea.save(function(err) {
                if (err) res.send(err);
            });

        });

  var activity = new Logger(); 
        console.log("trying to save log for enroll");
        activity.enrollIdea(
          function(err){
          if(err){ return next(err); }
    },
    req.idea.author, 
    new Date()
        ); 
  res.sendStatus(200);
});

router.post('/accept/:idea', auth, hf.validateDirector,function(req, res, next) {
  
  
    Idea.findById(req.idea._id, function(err, idea) {

            if (err) res.send(err);

      IdeaState.findByIdAndRemove(idea.ideaState, function (err){
        if(err) { return next(err); }
    console.log("pending state deleted");
    });

      var state = new IdeaState();
      state.title = 'accepted';
      idea.ideaState = state;
      console.log("accepting...");
     
            state.save(function(err) {
                if (err) res.send(err);
            });
            // 
            idea.save(function(err) {
                if (err) res.send(err);
            });

        });

  var activity = new Logger(); 
        console.log("trying to save log for accept");
        activity.acceptIdea(
          function(err){
          if(err){ return next(err); }
    },
    req.idea.author, 
    new Date()
        ); 
  res.sendStatus(200);
});


router.post('/remove/:idea',auth, hf.validateDirector,function(req, res, next) {
  Idea.findByIdAndRemove(req.idea.id, function (err){
      if(err) { return next(err); }

   });
  var activity = new Logger(); 

        activity.destroy(
          function(err){
          if(err){ return next(err); }
    },
    req.idea.author, 
    new Date()
        ); 
  res.sendStatus(200);
});






//PUT METHODS //

router.put('/:idea/upvote', auth, function(req, res, next) {
  req.idea.upvote(function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  });
});

router.put('/:idea/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    
    res.json(comment);
  });
});

router.put('/:idea/downvote', auth, function(req, res, next) {
  req.idea.downvote(function(err, idea){
    if (err) { return next(err); }

    res.json(idea);
  });
});

router.put('/:idea/comments/:comment/downvote', function(req, res, next) {
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;