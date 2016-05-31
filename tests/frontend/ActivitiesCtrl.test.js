describe('ActivityCtrl', function() {
  beforeEach(module('tips'));  //inject angular module

  var $controller;  //define controller
  var logger;       //this is the activities service


  beforeEach(inject(function(_$controller_, $injector){ //<-- the controller has to be between underscores
    $controller = _$controller_;
    logger = $injector.get('logger');
    
  }));

  describe('$scope.home', function() {
    it('should get recent activities', function() {
      
      
      var $scope = {};
      var controller = $controller('ActivityCtrl', { $scope: $scope, logger : logger });  // <-- Look carefully, we are basically instanting the controller here

     //mock getActivites function, to hell with the original function
      logger.getActivities = function(){ 
      	this.activities.push("log1");
      	this.activities.push("log2");
      	this.activities.push("log3");
        this.activities.push("log4");
      };

      $scope.activites = logger.getActivities();  // get the activities from the service

    
      expect($scope.activities).to.eql(["log1","log2","log3","log4"]);  //verify the activities content
    });

  });
});