var app = angular.module('tips');

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