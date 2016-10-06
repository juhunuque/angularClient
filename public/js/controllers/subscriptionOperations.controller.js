angular.module("dgApp")

.controller('SubscriptionOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', function($scope, $http, DTOptionsBuilder, Notification){

  // DataTables configurable options
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
        .withOption('bLengthChange', false)
        .withOption('autoWidth', true);

  $scope.refresh = function(){
    $http.get('/subscriptions').then(function(response){
     $scope.subscriptions = response.data;
   }, function(error){
     Notification.error({title:'Error getting subscriptions', message:'Check the console and try again.'});
     console.error('ERROR => ' + JSON.stringify(error.data));
   });
  }

  $scope.delete = function(subscription){
    var subscriptionId = getSubscriptionId(subscription);
    $http.delete('/subscriptions' + subscriptionId).then(function(response){
     Notification.success({title:'Success', message:'Subscription removed.'});
   }, function(error){
     Notification.error({title:'Error', message:'Check the console and try again.'});
     console.error('ERROR => ' + JSON.stringify(error.data));
   });
  }

  $scope.getSubscriptionId(subscription){
    return 1;
  }

}]);
