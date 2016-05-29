var app = angular.module('tips');

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