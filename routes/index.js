var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var UserRole = mongoose.model('UserRole');
var IdeaState = mongoose.model('IdeaState');
var Logger = mongoose.model('Logger');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});



router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('Unable to find post')); }

    req.post = post;
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


router.get('/posts', function(req, res, next) {
  //-secretField2  -secretField1
console.log("trying to get ideas with state: "+ req.query.type);
 
 

//nota mental: hacer un join en Mongo es un infierno
// Pesimo manejo de collecciones


	Post.find().populate({
		  path: 'ideaState',
		  match: {
		    title: req.query.type
		  }
		}).exec(function(err, posts) {
		  posts = posts.filter(function(post) {
		    
		     return post.ideaState; // return only users with email matching 'type: "Gmail"' query
		
		  });
		  console.log("posivble filtered values: "+posts);
		  res.json(posts);
	 });


});

router.get('/activities', function(req, res, next) {
  Logger.find(function(err, posts){
    if(err){ 
	return next(err);
    }

    res.json(posts);
  });

});

router.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }
    res.json(req.post);
  });
});





// POST METHODS //


router.post('/posts', auth, function(req, res, next) {
  var result;
  var post = new Post(req.body);
  post.author = req.payload.username;
   
  var ideaState = new IdeaState();
  ideaState.make(function(err){
    		if(err){ return next(err); }
 	},
	'available',
	'This idea is available to be taken')

  post.ideaState = ideaState;
  
  post.save(function(err, post){
    if(err){ return next(err); }

    var activity = new Logger(); 
    activity.createIdea(
        function(err){
    		if(err){ return next(err); }
 	},
	req.payload.username, 
	new Date()
    ); 
    console.log('saving new idea: '+post.title+ ' '+ post.author+  '  in state:'+ post.ideaState.title  )
    res.json(post);
  });

   
});


router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    	req.post.save(function(err, post) {
      		if(err){ return next(err); }

      		res.json(comment);
    	});
  });

});

router.post('/posts/enroll/:post', function(req, res, next) {
       console.log("enrolling idea-> "+req.post.author+ " " + req.post.title);

         Post.findById(req.post._id, function(err, idea) {

            if (err) res.send(err);

	    var state = new IdeaState();
  		state.title = 'pending';
  		idea.ideaState = state;
  		console.log("enrolling");
	   
            state.save(function(err) {
                if (err) res.send(err);
            });
            // save the bear
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
		req.post.author, 
		new Date()
        ); 
	res.sendStatus(200);
});


router.post('/posts/reject/:post', function(req, res, next) {
	req.post.reject(function(err, post){
   	 if(err){ return next(err); }

 	 },
	req.post.author,
	new Date());

	var activity = new Logger(); 

        activity.rejectIdea(
        	function(err){
    			if(err){ return next(err); }
 		},
		req.post.author, 
		new Date()
        ); 
	res.sendStatus(200);
});

router.post('/posts/delete/:post', function(req, res, next) {
	req.post.delet(function(err, post){
   	 if(err){ return next(err); }

 	 },
	req.post.author,
	new Date());

	var activity = new Logger(); 

        activity.deleteIdea(
        	function(err){
    			if(err){ return next(err); }
 		},
		req.post.author, 
		new Date()
        ); 
	res.sendStatus(200);
});

router.post('/posts/accept/:post', function(req, res, next) {
	
	
  	req.post.accept(function(err, post){
   	 if(err){ return next(err); }

 	 },
	req.post.author,
	new Date());

	var activity = new Logger(); 

        activity.acceptIdea(
        	function(err){
    			if(err){ return next(err); }
 		},
		req.post.author, 
		new Date()
        ); 

	res.sendStatus(200);
});


router.post('/posts/remove/:post', function(req, res, next) {
	Post.findByIdAndRemove(req.post.id, function (err){
    	if(err) { return next(err); }

 	 });
	var activity = new Logger(); 

        activity.destroy(
        	function(err){
    			if(err){ return next(err); }
 		},
		req.post.author, 
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

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
    res.json(post);
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    
    res.json(comment);
  });
});

router.put('/posts/:post/downvote', auth, function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/comments/:comment/downvote', function(req, res, next) {
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
