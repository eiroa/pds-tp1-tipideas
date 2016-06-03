var app = angular.module('tips');

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