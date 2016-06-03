var app = angular.module('tips');

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