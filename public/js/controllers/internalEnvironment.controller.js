angular.module("dgApp")

.controller('InternalEnvCtrl',['$scope','$http','$dataDg', 'Notification', 'lodash', function($scope, $http, $dataDg, Notification, lodash){

  var configs = {};
  var body = {};
  function refresh(){
    $scope.searchText = '';
    $scope.title = '';
    $scope.body = '';
    body = {};
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
            $scope.title = 'Event Service';
            if(!$scope.isStatusFormActive){
              makeRequest(configs.eventService);
            }
            break;
        case 1:
            $scope.title = 'Consumer Proxy';
            if(!$scope.isStatusFormActive){
              makeRequest(configs.eventServiceConsumerProxy);
            }
            break;
        case 2:
            $scope.title = 'Monitor';
            if(!$scope.isStatusFormActive){
              makeRequest(configs.eventServiceMonitor);
            }
            break;
        default:
            console.log('Error executing endpoint');
            break;
    }
    $scope.toggleStatusForm();
  };

  function makeRequest(url){
      var endpoint = '/env'
      $http.post('/routeget',{
      'url': url + endpoint
      }).then(function(response){
              $scope.body = response.data;
              body = response.data;
            }, function(error){
              $scope.body = 'Error requesting data.';
              Notification.error({title:'Error', message:'Check the console and try again.'});
              console.error('ERROR => ' + JSON.stringify(error.data));
            });
  };

    $scope.search = function(){
      $scope.body = body;
      if(lodash.has($scope.body, $scope.searchText)){
        $scope.body = body[$scope.searchText];
      }
    }

  refresh();

}]);
