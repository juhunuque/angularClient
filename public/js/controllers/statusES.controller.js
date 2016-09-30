angular.module("dgApp")

.controller('StatusESCtrl',['$scope','$http',function($scope, $http){
    console.log('StatusESCtrl Init...');

    function refresh(){
      $scope.title = '';
      $scope.isStatusFormActive = false;
      console.log('Refresh');
    };

    $scope.toggleStatusForm = function(){
      $scope.isStatusFormActive = !$scope.isStatusFormActive;
    };

    $scope.executeEndpoint = function(opt){
      switch (opt) {
          case 0:
              $scope.title = 'Root endpoint result';
              break;
          case 1:
              $scope.title = 'Status endpoint result';
              break;
          case 2:
              $scope.title = 'Healthcheck endpoint result';
              break;
          default:
              console.log('Error executing endpoint');
              break;
      }
      $scope.toggleStatusForm();
    };

    refresh();
}]);
