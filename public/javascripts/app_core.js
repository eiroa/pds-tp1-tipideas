var app = angular.module('tips', ['ui.router','angularMoment']);

app.factory('auth',['$http','$window',function($http,$window){
	var auth = {};

	auth.saveToken = function(token){
		$window.localStorage['token-tip'] = token;
	};
	
	auth.getToken = function(){
		return $window.localStorage['token-tip'];	
	};

	auth.isLoggedIn = function(){
 		var token = auth.getToken();

  		if(token){
   	        var payload = JSON.parse($window.atob(token.split('.')[1]));
    	        return payload.exp > Date.now() / 1000;
		
  	        } else {
			console.log('Not logged...');
    			return false;
  		}
	};

	auth.currentUser = function(){
  		if(auth.isLoggedIn()){
    			var token = auth.getToken();
    			var payload = JSON.parse($window.atob(token.split('.')[1]));

   		 return payload.username;
  		}
	};
	
	auth.register = function(user){
  		return $http.post('/register', user).success(function(data){
    				auth.saveToken(data.token);
 				 });
	};

	auth.logIn = function(user){
  		return $http.post('/login', user).success(function(data){
    			auth.saveToken(data.token);
  			});
	};

	auth.logOut = function(){
  		$window.localStorage.removeItem('token-tip');
	};

	return auth;
}])

app.factory('logger',['$http', 'auth',function($http,auth){

	var service = {
		activities:[]
	};

	service.getActivities = function(){
		return $http.get('/activities').success(function(data){
      			angular.copy(data, service.activities);
			console.log('activities loaded');
    		});
        };
	
	return service;
}]);

app.factory('posts',['$http', 'auth','logger',function($http,auth,logger){
	var service = {
		posts:[]
	};
	
	service.like = function(route,likeable){
  		         return $http.put(route,null,{
	headers : {Authorization: 'Bearer '+auth.getToken()}				
			})
    				.success(function(data){
      				likeable.upvotes += 1;
    			});
                       };

	service.dislike = function(route,likeable){
  		         return $http.put(route,null,{
	headers : {Authorization: 'Bearer '+auth.getToken()}				
			})
    				.success(function(data){
      				likeable.downvotes -= 1;
    			});
                       };

	service.getAll = function(type) {
   	 return $http({
    		url: '/posts', 
    		method: "GET",
    		params: {type:type}
 		}).success(function(data){
      			angular.copy(data, service.posts);
			console.log('posts cargados');
			logger.getActivities();
    		  });
  	};

	service.create = function(post){
		return $http.post('/posts',post,{
		   headers : {Authorization: 'Bearer '+auth.getToken()}			
		}).success(function(data){
			service.posts.push(data);
		});
	};
	

	service.upvote = function(post){
		return $http.put('/posts/'+post._id + '/upvote' , null,{
			headers : {Authorization: 'Bearer '+auth.getToken()}	
		})
			.success(function(data){
				posts.upvotes +=1;
			});
	};

	service.get = function(id){
				return $http.get('/posts/'+id).then(function(res){
					return res.data;
				});
			};

	service.addComment = function(id,comment){
		return $http.post('/posts/'+id+'/comments',comment, {
		headers : {Authorization: 'Bearer '+auth.getToken()}			
		});
	};

	service.removePost = function(post){
		return $http.post('posts/remove/'+post._id);
	};

	service.accept = function(post){
		return $http.post('posts/accept/'+post._id).success(function(data){
			
		});
	};

	service.deleteIdea = function(post){
		return $http.post('posts/delete/'+post._id).success(function(data){
			
		});
	};

	service.enroll = function(post){
		return $http.post('posts/enroll/'+post._id).success(function(data){
			
		});
	};

	
	service.reject = function(post){
		return $http.post('posts/reject/'+post._id).success(function(data){
			
		});
	};

	
        

	return service;
}]);



app.controller('AuthCtrl',['$scope','$state','auth', function($scope,$state,auth){
	$scope.user = {};
	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		 });	
	};
	
	$scope.logIn = function(){
		auth.logIn($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');		
		});	
	};

}]);

app.controller('ActivityCtrl',['$scope','logger','auth',function($scope,logger,auth){
	$scope.activities = logger.activities;
	$scope.isLoggedIn = auth.isLoggedIn;
}]);

app.controller('MainCtrl', [ '$scope', 'posts','$state', '$stateParams','auth',
function($scope,posts,$state,$stateParams,auth){
   


     $scope.req = function(){
	posts.getAll($scope.data.ideasSort.value);
     }


  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.posts = posts.posts;
  $scope.types = [
	{value:'available',name:"Available ideas"},
	{value:'accepted',name:"Accepted ideas for tips"},
	{value:'pending',name:"Ideas pending approval"},
	{value:'deleted',name:"Deleted ideas"}
];


$scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
  console.log('posting idea by '+auth.currentUser());
  posts.create({
	title: $scope.title, 
	link: $scope.link,
	date: Date.now(),  //le mandamos la fecha de una, atenti que aca estariamos usamos la fecha que reporta el cliente sin upvotes, ya que se definio que mongo lo crea en 0 por default
       user: auth.username
  });
 
	

  $scope.title ='';
  $scope.link ='';
};

$scope.remove = function(post){
	posts.removePost(post).success(function(data){
				console.log("post borrado");
				 $state.reload();
	});
};

$scope.addVote = function(post){
			posts.like('/posts/' + post._id + '/upvote',post)
                 };

$scope.downVote = function(post){
			posts.dislike('/posts/' + post._id + '/downvote',post)
                 };

$scope.accept = function(post){
		posts.accept(post);
		};

$scope.enroll = function(post){
		posts.enroll(post);
		};

$scope.deleteIdea = function(post){
		post.deleteIdea(post);
		};

$scope.reject = function(post){
		post.reject(post);
		};

}]);


app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
function($scope,posts,post,auth){

	$scope.post = post;
	$scope.isLoggedIn = auth.isLoggedIn;
	
	
	$scope.addComment = function(){
	  if($scope.body === '') { return; }

	  posts.addComment(post._id, {
    		body: $scope.body,
    		author: 'user',
		date: Date.now()
  		}).success(function(comment) {
    			$scope.post.comments.push(comment);
 	 });

	  $scope.body = '';
	};
	
	$scope.addVote = function(comment){
			posts.like('/posts/' + post._id + '/comments/'+comment._id+'/upvote',comment)
                 };
	$scope.downVote = function(comment){
			posts.dislike('/posts/' + post._id + '/comments/'+comment._id+'/downvote',comment)
                 };
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);




app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {



  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/partials/home.html',
      controller: 'MainCtrl',
      resolve: {
      	postPromise: ['posts','logger', function(posts){
      		return posts.getAll(true,false,false,false,false);
        }]
      }
  });


  $stateProvider
   .state('posts', {
    url: '/posts/{id}',
    templateUrl: '/partials/posts.html',
    controller: 'PostsCtrl',
    resolve: {
    	post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
    }]
  }
});

  $stateProvider.state('login', {
  url: '/login',
  templateUrl: '/partials/login.html',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('home');
    }
  }]
})
$stateProvider.state('register', {
  url: '/register',
  templateUrl: '/partials/register.html',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('home');
    }
  }]
});	

  $urlRouterProvider.otherwise('home');
}]);
