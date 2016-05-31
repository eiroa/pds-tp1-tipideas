var app = angular.module('tips');

app.controller('ActivityCtrl',['$scope','logger','auth',function($scope,logger,auth){
	$scope.activities = logger.activities;
	$scope.isLoggedIn = auth.isLoggedIn;
	
}]);
