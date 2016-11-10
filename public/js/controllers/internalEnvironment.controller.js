angular.module("dgApp")

.controller('InternalEnvCtrl',['$scope','$http','$dataDg', 'Notification', 'DTOptionsBuilder', '$utils', function($scope, $http, $dataDg, Notification, DTOptionsBuilder, $utils){

  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(50)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('destroy', true)
      .withOption('oLanguage', {"sEmptyTable": "No data available" })
      .withOption('autoWidth', true);

  var configs = {};

  function refresh(){
    $scope.searchText = '';
    $scope.objects = {}; 
    $scope.title = '';
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
              $scope.objects = $utils.jsonToArray(response.data,null,[]);
            }, function(error){
              Notification.error({title:'Error', message:'Check the console and try again.'});
              console.error('ERROR => ' + JSON.stringify(error.data));
            });
  };

  // $scope.objects = $utils.jsonToArray($scope.body,null,[]);

  refresh();

}]);
