angular.module("dgApp")

.controller('SubscriptionOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', '$dataDg', function($scope, $http, DTOptionsBuilder, Notification, $dataDg){

  var configs = {};

  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(10)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('destroy', true)
      .withOption('oLanguage', {"sEmptyTable": "No data available" })
      .withOption('autoWidth', true);

  $scope.refresh = function(){
    configs = $dataDg.getConfig();
    $scope.subscriptions = {};
    $scope.isLoading = true;
    $scope.loadingMsg = 'Loading subscriptions';

    $http.post('/routeget',{
    'url': configs.eventServiceConsumerProxy + '/subscriptions'
    }).then(function(response){
            $scope.subscriptions = response.data._embedded.subscriptions;
            Notification.success({title:'Success', message:'Subscriptions loaded.'});
            $scope.isLoading = false;
          }, function(error){
            Notification.error({title:'Error getting subscriptions', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
            $scope.isLoading = false;
          });
  };


  $scope.delete = function(subscription){
        var subscriptionId = $scope.getSubscriptionId(subscription._links.self.href);
        $scope.loadingMsg = 'Removing ' + subscription.name;
        $scope.isLoading = true;
        $http.post('/routedelete',{
          'url': configs.eventServiceConsumerProxy + '/subscriptions/' + subscriptionId
        }).then(function(response){
            var i = $scope.subscriptions.indexOf(subscription);
            if(i != -1) {
                $scope.subscriptions.splice(i, 1);
            }
            Notification.success({title:'Success', message:'Subscription removed.'});
            $scope.isLoading = false;

       }, function(error){
         Notification.error({title:'Error', message:'Check the console and try again.'});
         console.error('ERROR => ' + JSON.stringify(error.data));
         $scope.isLoading = false;
       });
     };

  $scope.getSubscriptionId = function(subscription){
    var split = subscription.split("/");
    return split[split.length - 1];
  };

  $scope.hideLoading = function(){
        $scope.isLoading = false;
    }

  $scope.refresh();

}]);
