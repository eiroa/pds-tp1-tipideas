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

app.factory('posts', ['$http', 'auth',function($http){
	var service = {
		posts:[]
	};
	
	service.like = function(route,likeable){
  		         return $http.put(route,{
	headers : {Authorization: 'Bearer '+auth.getToken()}				
			})
    				.success(function(data){
      				likeable.upvotes += 1;
    			});
                       };

	service.dislike = function(route,likeable){
  		         return $http.put(route)
    				.success(function(data){
      				likeable.downvotes -= 1;
    			});
                       };

	service.getAll = function() {
   	 return $http.get('/posts').success(function(data){
      		angular.copy(data, service.posts);
		console.log('posts cargados');
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

app.controller('MainCtrl', [ '$scope', 'posts','$state', '$stateParams','auth',
function($scope,posts,$state,$stateParams,auth){
  $scope.test = 'Hello world!';
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.posts = posts.posts;


$scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
  posts.create({
	title: $scope.title, 
	link: $scope.link,
	date: Date.now()  //le mandamos la fecha de una, atenti que aca estariamos usamos la fecha que reporta el cliente
       // sin upvotes, ya que se definio que mongo lo crea en 0 por default
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
      	postPromise: ['posts', function(posts){
      	return posts.getAll();
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
