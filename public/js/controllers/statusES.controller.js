angular.module("dgApp")

.controller('StatusESCtrl',['$scope','$http','$dataDg', 'Notification',function($scope, $http, $dataDg, Notification){

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
                    makeRequest('');
                  }
                  break;
              case 1:
                  $scope.title = 'Status endpoint result';
                  if(!$scope.isStatusFormActive){
                    makeRequest('/status');
                  }
                  break;
              case 2:
                  $scope.title = 'Healthcheck endpoint result';
                  if(!$scope.isStatusFormActive){
                    makeRequest('/healthcheck');
                  }
                  break;
              default:
                  console.log('Error executing endpoint');
                  break;
          }
          $scope.toggleStatusForm();
        };

        function makeRequest(endpoint){
            $http.post('/governance',{
            'url': configs.eventService + endpoint
            }).then(function(response){
                    $scope.body = response.data;
                  }, function(error){
                    Notification.error({title:'Error', message:'Check the console and try again.'});
                    console.error('ERROR => ' + JSON.stringify(error.data));
                  });
        };

        refresh();
}]);
