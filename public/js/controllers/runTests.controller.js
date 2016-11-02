angular.module("dgApp")

.controller('RunTestsCtrl',['$scope','$http', 'Notification', '$dataDg', function($scope, $http, Notification, $dataDg){

  var configs = {};
  $scope.refresh = function(){
    configs = $dataDg.getConfig();
    $scope.isRunning = false;
    $scope.isAvailable = true;
    $scope.statusMsg = 'Ready to run tests';
    $scope.consoleOutput = 'No data.';
    $scope.space = configs.cfDiet;
    $scope.lastStatus = '';
    $scope.lastDt = '';
    $scope.lastBuildNumber = '';
    $scope.isConsoleActive = false;

    isServerAvailable();
  }

  $scope.printtest = function(){
    console.log('CONSOLE => ', $scope.isConsoleActive);
  }

  $scope.getTextColor = function(item){
    switch (item.toLowerCase()) {
      case 'success':
        return 'green-text text-accent-4';
        break;
      case 'failed':
        return 'red-text text-accent-4';
        break;
      case 'failure':
        return 'red-text text-accent-4';
        break;
      case 'error':
        return 'red-text text-accent-4';
        break;
      case 'running':
        return 'amber-text text-accent-4';
        break;
      default:
        return 'black-text';
        break;
    }
  }

  $scope.runTests = function(){
    $http.post('/jenkins/build').then(function(response){
        Notification.success({title:'Success', message:'Build has started.'});
      $scope.isRunning = true;
      $scope.isAvailable = false;
      $scope.statusMsg = 'Preparing build';
      $scope.lastStatus = 'Running';

      setTimeout(function(){
        console.log('PRINT');
        getServerStatus();
      }, 11000);
      }, function(error){
        Notification.error({title:'Error', message:'Check the console and try again.'});
        console.error('ERROR => ' + JSON.stringify(error.data));
      });
  }

  function isServerAvailable(){
    $http.get('/jenkins/info').then(function(response){

            var data = JSON.parse(response.data.status);
            if(data.buildable == true){
                $scope.isAvailable = true;
                getServerStatus();
            }else{
                $scope.isAvailable = false;
                $scope.statusMsg = 'Server not available';
                $scope.lastStatus = 'Error';
            }
          }, function(error){
            Notification.error({title:'Error', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
          });
  }

  function getServerStatus(){
     $http.get('/jenkins/lastbuild/status').then(function(response){
            var data = JSON.parse(response.data.lastBuildStatus);
            $scope.lastDt = new Date(data.timestamp);
            $scope.lastStatus = data.result == null ? 'Running' : data.result;
            $scope.consoleOutput = response.data.lastBuildConsoleText;
            $scope.lastBuildNumber = data.number;

            if(data.result == null){
                $scope.isRunning = true;
                $scope.isAvailable = false;
                $scope.statusMsg = 'Running tests';
            }else{
                $scope.isRunning = false;
                $scope.isAvailable = true;
                $scope.statusMsg = 'Ready to run tests';
            }

            if($scope.isRunning == true){
                getServerStatus();
            }

          }, function(error){
            Notification.error({title:'Error', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
          });
  }


  $scope.refresh();
}]);
