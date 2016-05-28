var app = angular.module('tips');

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
		}).success(function(data){
			service.ideas.push(data);
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
		return $http.post('ideas/accept/'+idea._id,null,{headers : {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
		});
	};

	service.deleteIdea = function(idea){
		return $http.post('ideas/delete/'+idea._id,null,{headers : {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
	
		});
	};

	service.enroll = function(idea){
		return $http.post('ideas/enroll/'+idea._id,null,{headers : {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			
		});
	};

	
	service.reject = function(idea){
		return $http.post('ideas/reject/'+idea._id,null,{headers : {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			
		});
	};


	
        

	return service;
}]);