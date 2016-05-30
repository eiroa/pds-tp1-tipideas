var app = angular.module('tips');

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