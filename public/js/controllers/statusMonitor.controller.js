angular.module("dgApp")

.controller('StatusMonitorCtrl',['$scope','$http','$dataDg', 'Notification',function($scope, $http, $dataDg, Notification){

    var configs = {};
        function refresh(){
          $scope.title = '';
          $scope.body = '';
          $scope.isStatusFormActive = false;
          configs = $dataDg.getConfig();
        };

        $scope.toggleStatusForm = function(){
          $scope.isStatusFormActive = !$scope.isStatusFormActive;

          if(!$scope.isStatusFormActive){
            refresh();
          }
        };

        $scope.executeEndpoint = function(opt){
          switch (opt) {
              case 0:
                  $scope.title = 'Root endpoint result';
                  if(!$scope.isStatusFormActive){
                    makeRequest('/getrootinfo');
                  }
                  break;
              case 1:
                  $scope.title = 'Status endpoint result';
                  if(!$scope.isStatusFormActive){
                    makeRequest('/getstatusinfo');
                  }
                  break;
              case 2:
                  $scope.title = 'Healthcheck endpoint result';
                  if(!$scope.isStatusFormActive){
                    makeRequest('/gethealthcheckinfo');
                  }
                  break;
              default:
                  console.log('Error executing endpoint');
                  break;
          }
          $scope.toggleStatusForm();
        };

        function makeRequest(endpoint){
            $http.post(endpoint,{
            'url': configs.eventServiceMonitor
            }).then(function(response){
                    $scope.body = response.data;
                  }, function(error){
                    Notification.error({title:'Error', message:'Check the console and try again.'});
                    console.error('ERROR => ' + JSON.stringify(error.data));
                  });
        };

        refresh();
}]);