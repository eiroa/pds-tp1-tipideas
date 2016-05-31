var app = angular.module('tips');

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
		$scope.newTags = [];
		$scope.tags = [];
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
			if($scope.urlForm.urlInput.$valid && $scope.newLink != null && $scope.newLink != ''){
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
$scope.subjectsSelected = [];
$scope.newTags = [];
$scope.tags = [];

};

$scope.remove = function(idea){
	ideas.removeIdea(idea).success(function(data){
		console.log("idea borrada");
		$state.reload();
		removeIdea(idea);
		logger.getActivities();
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
		ideas.deleteIdea(idea).success(function(){
			logger.getActivities();
		});
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