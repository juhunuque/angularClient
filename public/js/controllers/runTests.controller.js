angular.module("dgApp")

.controller('RunTestsCtrl',['$scope','$http', function($scope, $http){

  $scope.refresh = function(){
    $scope.isRunning = false;
    $scope.statusMsg = 'Ready';
    $scope.consoleOutput = '';
    $scope.space = 'devint';
    $scope.lastStatus = 'Success';
    $scope.lastDt = '10/29/16';
  }

  $scope.getTextColor = function(item){
    switch (item.toLowerCase()) {
      case 'success':
        return 'green-text text-accent-4';
        break;
      case 'failed':
        return 'red-text text-accent-4';
        break;
      default:
        return 'black-text';
        break;
    }
  }

  $scope.runTests = function(){
    console.log('Run');
  }

  $scope.refresh();
}]);
