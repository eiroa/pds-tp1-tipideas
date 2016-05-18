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

app.factory('ideas',['$http', 'auth','logger','subjects',function($http,auth,logger,subjects){
	var service = {
		ideas:[]
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
    		url: '/ideas', 
    		method: "GET",
    		params: {type:type}
 		}).success(function(data){
                        console.log(data);
      			angular.copy(data, service.ideas);
			console.log('ideas loaded');
			logger.getActivities();
			subjects.getAll();
			
    		  });
  	};

	service.create = function(idea){
		return $http.post('/ideas',idea,{
		   headers : {Authorization: 'Bearer '+auth.getToken()}			
		});
	};
	

	service.upvote = function(idea){
		return $http.put('/ideas/'+idea._id + '/upvote' , null,{
			headers : {Authorization: 'Bearer '+auth.getToken()}	
		})
			.success(function(data){
				ideas.upvotes +=1;
			});
	};

	service.get = function(id){
				return $http.get('/ideas/'+id).then(function(res){
					return res.data;
				});
			};

	service.addComment = function(id,comment){
		return $http.post('/ideas/'+id+'/comments',comment, {
		headers : {Authorization: 'Bearer '+auth.getToken()}			
		});
	};


	service.removeIdea = function(idea){
                console.log("sending removal of idea with token "+ auth.getToken());
		return $http.post('ideas/remove/'+idea._id,null,{
		   headers : {Authorization: 'Bearer '+auth.getToken()}			
		});
	};

	service.accept = function(idea){
		return $http.post('ideas/accept/'+idea._id,null,{
			headers : {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	service.deleteIdea = function(idea){
		return $http.post('ideas/delete/'+idea._id,null,{
			headers : {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	service.enroll = function(idea){
		return $http.post('ideas/enroll/'+idea._id,null,{
			headers : {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	
	service.reject = function(idea){
		return $http.post('ideas/reject/'+idea._id,null,{
			headers : {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	
        

	return service;
}]);


app.factory('users',['$http', 'auth',function($http,auth){
	var service = {
		users:[]
	};
	
	service.getAll = function(){
		return $http.get('/users').success(function(data){
      			angular.copy(data, service.users);
			console.log('users loaded');
    		});
        };

	service.changeRole = function(user,role){
		return $http.post('/users/changeRole',{ _id :user._id, value:role.value},{
		   headers : {Authorization: 'Bearer '+auth.getToken()}			
		}).success(function(){
			user.userRole.title=role.value;
		});
	};


	return service;
}]);

app.factory('subjects',['$http', 'auth',function($http,auth){
	var service = {
		subjects:[]
	};
	
	service.getAll = function(){
		return $http.get('/subjects').success(function(data){
      			angular.copy(data, service.subjects);
			console.log('subjects loaded');
    		});
        };

	service.create = function(subject){
		return $http.post('/subjects/create',subject,{
		   headers : {Authorization: 'Bearer '+auth.getToken()}			
		}).success(function(data){
			service.getAll();
		});
	};

	service.edit = function(subject){
		return $http.post('/subjects/edit',subject,{
		   headers : {Authorization: 'Bearer '+auth.getToken()}			
		}).success(function(data){
			service.getAll();
		});
	};

	service.removeSubject = function(subject){
		return $http.post('/subjects/delete',{_id:subject._id},{
		   headers : {Authorization: 'Bearer '+auth.getToken()}			
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
			$scope.registered = true;
		});	
	};
	
	$scope.logIn = function(){
		auth.logIn($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');		
		});	
	};


	$scope.currentUser = auth.currentUser;

}]);

app.controller('SubjectCtrl',['$scope','$state','auth','subjects','logger', function($scope,$state,auth,subjects,logger){
	$scope.currentUser = auth.currentUser;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.subjects = subjects.subjects;
	
	$scope.addSubject = function(){
	  if(!$scope.title || $scope.title === '') { return; }
		  subjects.create({
			title: $scope.title, 
			description: $scope.description
		  }).error(function(error,status){
			if(status==403){
				$scope.error = {message:""};
				$scope.error.message = "Your user is not authorized for this action";
			}
		
		});

	  $scope.title ='';
	  $scope.description ='';
	};

	$scope.remove = function(sub){
		subjects.removeSubject(sub).success(function(data){
				console.log("materia borrada");
	                $state.reload();
        		removeSubject(sub);
		
		}).error(function(error,status){
			if(status==403){
				$scope.error = {message:""};
				$scope.error.message = "Your user is not authorized for this action";
			};
		});
      }

	$scope.edit = function(sub){
		$scope.editing = true;
		$scope.toEdit = sub;
		$scope.title = sub.title;
	 	$scope.description = sub.description;
		
	}

	$scope.editSubject = function(){
	  if(!$scope.title || $scope.title === '') { return; }
		  subjects.edit({
                        _id: $scope.toEdit._id,
			title: $scope.title, 
			description: $scope.description
		  }).error(function(error,status){
			if(status==403){
				$scope.error = {message:""};
				$scope.error.message = "Your user is not authorized for this action";
			}
		
		});

	  $scope.title ='';
	  $scope.description ='';
	  $scope.editing = false;
	  $scope.toEdit = null;
	}

	$scope.cancelEdit = function(){
		$scope.editing = false;
	  	$scope.toEdit = null;
		$scope.title ='';
	 	 $scope.description ='';
	}
	

	function removeSubject(sub){
		var index = subjects.subjects.indexOf(idea);
	  	subjects.subjects.splice(index, 1); 
	} 


	

}]);

app.controller('ActivityCtrl',['$scope','logger','auth',function($scope,logger,auth){
	$scope.activities = logger.activities;
	$scope.isLoggedIn = auth.isLoggedIn;
	
}]);

app.controller('MainCtrl', [ '$scope', 'ideas','$state', '$stateParams','auth','subjects','logger',
function($scope,ideas,$state,$stateParams,auth,subjects,logger){
   
      	
	function checkStudent(){
		if(auth.getRole() == 'student'){
			$scope.types.splice(2, 2); 
		}
	}


	$scope.noTagAdd = function(){return false;}	

	$scope.noTagRemove = function(){return false;}

     $scope.urlRegex = RegExp('^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$', 'i');

     $scope.req = function(){
	ideas.getAll($scope.data.ideasSort.value);
     }

	$scope.validateProfOrDir = function(){
		return auth.getRole() == 'director' || auth.getRole() == 'professor';
	}
		
	$scope.validateDir = function(){
		return auth.getRole() == 'director';
	}


  $scope.subjects = subjects.subjects;
  $scope.subjectsSelected = [];
  
  $scope.links = [];
  $scope.tags = [];
  $scope.newTags = [];
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.ideas = ideas.ideas;
  $scope.types = [
	{value:'available',name:"Available ideas"},
	{value:'accepted',name:"Accepted ideas for tips"},
	{value:'pending',name:"Ideas pending approval"},
	{value:'deleted',name:"Deleted ideas"}
	];

	$scope.addSubject = function(sub){
		addSub(sub,$scope.subjectsSelected);
		removeSub(sub,subjects.subjects);
	}

	$scope.removeSubject = function(sub){
		addSub(sub,subjects.subjects);
		removeSub(sub,$scope.subjectsSelected);
	}

	$scope.addLink = function(){
		console.log($scope.newLink)
		if($scope.urlForm.urlInput.$valid && $scope.newLink!= null && $scope.newLink != ''){
			$scope.links.push($scope.newLink);
			$scope.newLink = '';
		}
	}
        $scope.formatLink = function(link){
		if(link.substring(0, 3) !="htt"){
			link = "//"+link;
		}
		return link;	
	}


$scope.addIdea = function(){
  if(!$scope.title || $scope.title === '') { return; }


	for (i = 0; i < ($scope.tags).length; i++) {
			$scope.newTags.push(($scope.tags)[i].text);
		}
  $scope.copySubjectsSelected = $scope.subjectsSelected.slice();
  ideas.create({
	title: $scope.title, 
	description: $scope.description,
	date: Date.now(),  //le mandamos la fecha de una, atenti que aca estariamos usamos la fecha que reporta el cliente sin upvotes, ya que se definio que mongo lo crea en 0 por default
	subjects: $scope.subjectsSelected,
	links: $scope.links,
	tags: $scope.newTags,
    user: auth.username
  }).success(function(data){
  			data.subjects = $scope.copySubjectsSelected;
			ideas.ideas.push(data);
			$scope.copySubjectsSelected = [];
			logger.getActivities();
		}).error(function(error,status){
        if(status==403){
		$scope.error = {message:""};
		$scope.error.message = "Your user is not authorized for this action";
	}
		
});

  $scope.title ='';
  $scope.description ='';
  $scope.links=[];
  $scope.newTags = [];
  $scope.subjectsSelected = [];
  $scope.tags = [];
};

$scope.remove = function(idea){
	ideas.removeIdea(idea).success(function(data){
				console.log("idea borrada");
				 $state.reload();
        removeIdea(idea);
		
	});
};

$scope.addVote = function(idea){
			ideas.like('/ideas/' + idea._id + '/upvote',idea)
                 };

$scope.downVote = function(idea){
			ideas.dislike('/ideas/' + idea._id + '/downvote',idea)
                 };

function removeIdea(idea){
	var index = ideas.ideas.indexOf(idea);
  			ideas.ideas.splice(index, 1); 
} 

function removeSub(sub,col){
	var index = col.indexOf(sub);
  			col.splice(index, 1); 
}

function addSub(sub,col){
  	col.push(sub); 
}

$scope.accept = function(idea){
		ideas.accept(idea).success(function(){
			logger.getActivities();
		});
		 removeIdea(idea);
		};

$scope.enroll = function(idea){
		ideas.enroll(idea).success(function(){
			logger.getActivities();
		});
		removeIdea(idea);
		};

$scope.deleteIdea = function(idea){
		ideas.deleteIdea(idea);
		removeIdea(idea);
		};

$scope.reject = function(idea){
		ideas.reject(idea).success(function(){
			logger.getActivities();
		});
		removeIdea(idea);
		};

$scope.currentUser = auth.currentUser;
checkStudent();

}]);


app.controller('ideasCtrl', [
'$scope',
'ideas',
'idea',
'auth',
'logger',
function($scope,ideas,idea,auth,logger){

	$scope.idea = idea;
	$scope.isLoggedIn = auth.isLoggedIn;
	
	
	$scope.addComment = function(){
	  if($scope.body === '') { return; }

	  ideas.addComment(idea._id, {
    		body: $scope.body,
    		author: 'user',
		date: Date.now()
  		}).success(function(comment) {
    			$scope.idea.comments.push(comment);
    			logger.getActivities();
 	 });

	  $scope.body = '';
	};
	
	$scope.addVote = function(comment){
			ideas.like('/ideas/' + idea._id + '/comments/'+comment._id+'/upvote',comment)
                 };
	$scope.downVote = function(comment){
			ideas.dislike('/ideas/' + idea._id + '/comments/'+comment._id+'/downvote',comment)
                 };
}]);



app.controller('UserCtrl', [
'$scope',
'users',
'auth',
function($scope,users,auth){

	$scope.users = users.users;
	$scope.isLoggedIn = auth.isLoggedIn;


    $scope.changeRole = function(user,role){
        users.changeRole(user,role);
     }

  $scope.roles = [
	{value:'director',name:"Director"},
	{value:'professor',name:"Professor"},
	{value:'student',name:"Student"},
	{value:'pending',name:"Pending"},
	{value:'disabled',name:"Disabled"}
];
	
	
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
$scope.validateDir = function(){
		return auth.getRole() == 'director';
	}
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


