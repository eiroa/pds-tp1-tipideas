var app = angular.module('tips');

app.controller('SubjectCtrl',['$scope','$state','auth','subjects', function($scope,$state,auth,subjects){
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