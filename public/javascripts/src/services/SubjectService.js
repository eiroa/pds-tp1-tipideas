var app = angular.module('tips');

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