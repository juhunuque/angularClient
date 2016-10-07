angular.module("dgApp")

.controller('SubscriptionOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', '$dataDg', function($scope, $http, DTOptionsBuilder, Notification, $dataDg){

  // DataTables configurable options
  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(10)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('autoWidth', true);

  var configs = {};


  $scope.refresh = function(){
    configs = $dataDg.getConfig();

    $http.post('/routeget',{
    'url': configs.eventServiceConsumerProxy + '/subscriptions'
    }).then(function(response){
            $scope.subscriptions = response.data._embedded.subscriptions;
            console.log("SUBSCRIPTIONS => " + JSON.stringify($scope.subscriptions));
            Notification.success({title:'Success', message:'Subscriptions loaded.'});
          }, function(error){
            Notification.error({title:'Error getting subscriptions', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
          });
  };


  $scope.delete = function(subscription){
        var subscriptionId = getSubscriptionId(subscription);
        $http.post('/routedelete',{
          'url': configs.eventServiceConsumerProxy + '/subscriptions/' + subscriptionId
        }).then(function(response){
         Notification.success({title:'Success', message:'Subscription removed.'});
       }, function(error){
         Notification.error({title:'Error', message:'Check the console and try again.'});
         console.error('ERROR => ' + JSON.stringify(error.data));
       });
     };

  $scope.getSubscriptionId = function(subscription){
    var split = subscription.split("/");
    return split[split.length - 1];
  };

  $scope.refresh();

}]);
