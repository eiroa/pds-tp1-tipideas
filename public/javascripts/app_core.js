var app = angular.module('tips', ['ui.router','angularMoment','ngTagsInput']);


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
  		return $http.post('/register', user).success(function(){
    				console.log("user succesfully registered");
 				 });
	};

	auth.logIn = function(user){
                console.log("executing login");
  		return $http.post('/login', user).success(function(data){
    			auth.saveToken(data.token);
			auth.saveRole(data.role);
  			});
	};

	auth.saveRole = function(role){
		$window.localStorage['userRole'] = role;
	}

	auth.logOut = function(){
  		$window.localStorage.removeItem('token-tip');
		$window.localStorage.removeItem('userRole');
	};

	auth.getRole = function(){
  		return $window.localStorage['userRole'];
	};

	return auth;
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
      	logs: function($stateParams,logger){
      		return logger.getActivities();
        },
	    subs:  function($stateParams,subjects){
      		return subjects.getAll();
      	}
      }
  });


  $stateProvider
   .state('ideas', {
    url: '/ideas/{id}',
    templateUrl: '/partials/ideas.html',
    controller: 'ideasCtrl',
    resolve: {
    	idea: ['$stateParams', 'ideas', function($stateParams, ideas) {
          return ideas.get($stateParams.id);
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
});

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

$stateProvider.state('users', {
  url: '/users',
  templateUrl: '/partials/users.html',
  controller: 'UserCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(!auth.isLoggedIn()){
      $state.go('home');
    }
  }],
    resolve: {
    	usersPromise: ['$stateParams', 'users', function($stateParams, users) {
          return users.getAll();
    	}]
   }
});	

$stateProvider.state('subjects', {
  url: '/subjects',
  templateUrl: '/partials/subjects.html',
  controller: 'SubjectCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(!auth.isLoggedIn()){
      $state.go('home');
    }
  }],
    resolve: {
    	subsPromise: ['$stateParams', 'subjects', function($stateParams, subjects) {
          return subjects.getAll();
    	}]
   }
});	

  $urlRouterProvider.otherwise('home');
}]);


