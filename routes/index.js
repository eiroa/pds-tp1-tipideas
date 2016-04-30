var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Idea = mongoose.model('Idea');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var UserRole = mongoose.model('UserRole');
var IdeaState = mongoose.model('IdeaState');
var Logger = mongoose.model('Logger');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});



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

// GET METHODS //


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/ideas', function(req, res, next) {
  //-secretField2  -secretField1
console.log("trying to get ideas with state: "+ req.query.type);
 
 

//nota mental: hacer un join en Mongo es un infierno
// Pesimo manejo de collecciones


	Idea.find().populate({
		  path: 'ideaState',
		  match: {
		    title: req.query.type
		  }
		}).exec(function(err, ideas) {
		  ideas = ideas.filter(function(idea) {
		    
		     return idea.ideaState; // return only ideas with parameter idea state		
		  });
		  res.json(ideas);
	 });



});

router.get('/activities', function(req, res, next) {

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate()-7);

  Logger.find({date: {$gte: cutoff}},function(err, ideas){
    if(err){ 
	return next(err);
    }


    res.json(ideas);
  });

});

router.get('/ideas/:idea', function(req, res) {
  req.idea.populate('comments', function(err, idea) {
    if (err) { return next(err); }
    res.json(req.idea);
  });
});





// idea METHODS //


router.post('/ideas', auth, function(req, res, next) {
  var result;
  var idea = new Idea(req.body);
  idea.author = req.payload.username;
   
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


router.post('/ideas/:idea/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.idea = req.idea;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.idea.comments.push(comment);
    	req.idea.save(function(err, idea) {
      		if(err){ return next(err); }

      		res.json(comment);
    	});
  });

});

router.post('/ideas/enroll/:idea', function(req, res, next) {
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


router.post('/ideas/reject/:idea', function(req, res, next) {
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

router.post('/ideas/delete/:idea', function(req, res, next) {

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

router.post('/ideas/accept/:idea', function(req, res, next) {
	
	
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


router.post('/ideas/remove/:idea', function(req, res, next) {
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


router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password)


  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});



//PUT METHODS //

router.put('/ideas/:idea/upvote', auth, function(req, res, next) {
  req.idea.upvote(function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  });
});

router.put('/ideas/:idea/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    
    res.json(comment);
  });
});

router.put('/ideas/:idea/downvote', auth, function(req, res, next) {
  req.idea.downvote(function(err, idea){
    if (err) { return next(err); }

    res.json(idea);
  });
});

router.put('/ideas/:idea/comments/:comment/downvote', function(req, res, next) {
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
