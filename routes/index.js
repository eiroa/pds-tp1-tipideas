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
var Subject = mongoose.model('Subject');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


function validateRole(roles,req,res,next){
	var result;
	User.findOne({ username: req.payload.username }).populate('userRole').exec( function (err, user) {
           if (err) { return next(err); }

		for (i = 0; i < roles.length; i++) {
		    if (roles[i] == user.userRole.title){
			return next();
		     }
		}
		res.sendStatus(403);
         });
}

function validateProfessor(req,res,next){
	validateRole(['professor','director'],req,res,next);
}

function validateDirector(req,res,next){
	 validateRole(['director'],req,res,next);

}

function validateStudent(req,res,next){
  	validateRole(['student'],req,res,next);
}

router.param('idea', function(req, res, next, id) {
  var query = Idea.findById(id);
  console.log("idea taken");

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

router.get('/activities', function(req, res, next) {

  var cutoff = new Date();  
  cutoff.setDate(cutoff.getDate()-7);  // seteamos un corte de fecha que sea una semana previa al dia que se ejecute la ruta

  Logger.find({date: {$gte: cutoff}},function(err, ideas){
    if(err){ 
	return next(err);
    }


    res.json(ideas);
  });

});

router.get('/users', function(req, res, next) {

//Dame todos los usuarios, no me muestres el hash y populame el userRole
  User.find().select('-hash').populate({
		  path: 'userRole'
		}).exec(function(err, users) {
			if(err){ return next(err);}
		  res.json(users);
	 });

});

router.get('/ideas/:idea', function(req, res) {
  req.idea.populate('comments', function(err, idea) {
    if (err) { return next(err); }
    res.json(req.idea);
  });
});

router.get('/subjects', function(req, res, next) {
// solo dame las materias
  Subject.find({},function(err, subs){
    if(err){ 
	return next(err);
    }
	res.json(subs);
  });

});




//Post Methods

//User methods

router.post('/users/changeRole', auth, validateDirector,function(req, res, next) {
	
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


router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();
  var userRole = new UserRole();

  userRole.title='pending';
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


//subject methods

router.post('/subjects/create', auth, validateDirector, function(req, res, next) {
  var subject = new Subject();
  subject.title = req.body.title;
  subject.description = req.body.description;

  subject.save(function(err, comment){
    if(err){ return next(err); }
	res.sendStatus(200);
  });

});

router.post('/subjects/edit', auth, validateDirector, function(req, res, next) {

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

router.post('/subjects/delete', auth, validateDirector, function(req, res, next) {
  Subject.findByIdAndRemove(req.body._id, function (err){
    	if(err) { return next(err); }
	res.sendStatus(200);
  });
	
});

// idea METHODS //


router.post('/ideas', auth, validateProfessor,function(req, res, next) {
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


router.post('/ideas/:idea/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.idea = req.idea;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.idea.comments.push(comment);
    	req.idea.save(function(err, idea) {
      		if(err){ return next(err); }

          var activity = new Logger(); 
        console.log("trying to save log for a made comment");
        activity.makeComment(
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





router.post('/ideas/enroll/:idea', auth, validateStudent, function(req, res, next) {
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


router.post('/ideas/reject/:idea', auth,validateDirector, function(req, res, next) {
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

router.post('/ideas/delete/:idea', auth,validateDirector,function(req, res, next) {

         Idea.findById(req.idea._id, function(err, idea) {

            if (err) res.send(err);

            IdeaState.findByIdAndRemove(idea.ideaState, function (err){
    		if(err) { return next(err); }
		console.log("available state deleted");
 	 	});

	    var state = new IdeaState();
  		state.title = 'deleted';
  		idea.ideaState = state;
  		console.log("deleting idea...");
	   
            state.save(function(err) {
                if (err) res.send(err);
            });
            
            idea.save(function(err) {
                if (err) res.send(err);
            });

        });

	var activity = new Logger(); 
        console.log("trying to save log for delete");
        activity.deleteIdea(
        	function(err){
    			if(err){ return next(err); }
 		},
		req.idea.author, 
		new Date()
        ); 
	res.sendStatus(200);
});

router.post('/ideas/accept/:idea', auth, validateDirector,function(req, res, next) {
	
	
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


router.post('/ideas/remove/:idea',auth, validateDirector,function(req, res, next) {
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
