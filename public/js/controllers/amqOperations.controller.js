angular.module("dgApp")

.controller('AmqOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', '$dataDg', function($scope, $http, DTOptionsBuilder, Notification, $dataDg){
  var configs = {};
  $scope.tableMsg = "Loading queues";

  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(10)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('oLanguage', {"sEmptyTable": $scope.tableMsg })
      .withOption('autoWidth', true);

  $scope.refresh = function(){
    configs = $dataDg.getConfig();
    $scope.objects = {};
    $scope.tableMsg = "Loading subscriptions";

    $http.get('/queuelist').then(function(response){
            $scope.objects = response.data.queues;
            Notification.success({title:'Success', message:'Queues loaded.'});
            $scope.tableMsg = "No data available";
          }, function(error){
            Notification.error({title:'Error getting queues', message:'Check the console and try again.'});
            $scope.tableMsg = "Error getting queues";
            console.error('ERROR => ' + JSON.stringify(error.data));
          });
    };

    $scope.refresh();

}]);
