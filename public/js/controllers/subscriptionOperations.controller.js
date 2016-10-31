angular.module("dgApp")

.controller('SubscriptionOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', '$dataDg', 'lodash', function($scope, $http, DTOptionsBuilder, Notification, $dataDg, lodash){

  var configs = {};
  var selectedSubscription = {};

  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(50)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('destroy', true)
      .withOption('oLanguage', {"sEmptyTable": "No data available" })
      .withOption('autoWidth', true);

    function clean(){
        $scope.deleteConfirm = false;
        $scope.redeliveryCount = 0;
        $scope.flushRedeliveryMsgs = true;
        $scope.isLoading = false;
        $scope.isSharedEndpoint = false;
    }

  $scope.refresh = function(){
    clean();
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

    $scope.delete = function(){
        var subscriptionId = $scope.getSubscriptionId(selectedSubscription._links.self.href);
        $http.post('/deletesubscription',{
          'url': configs.eventServiceConsumerProxy + '/subscriptions/' + subscriptionId,
          'flushRedeliveryMsgs': $scope.flushRedeliveryMsgs,
          'subscriptionendpoint': selectedSubscription.deliveryMethod.endpoint,
          'cfdiet': configs.cfDiet
        }).then(function(response){
            var i = $scope.subscriptions.indexOf(selectedSubscription);
            if(i != -1) {
                $scope.subscriptions.splice(i, 1);
            }
            Notification.success({title:'Success', message:'Subscription removed.'});
            clean();

       }, function(error){
            Notification.error({title:'Error', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
            clean();
       });
     };

     $scope.delete.confirm = function(subscription){
         $scope.redeliveryCount = 0;
         $scope.subscriptionName = subscription.name;
         selectedSubscription = subscription;
         $http.get('/redeliverymessagecount?subscriptionname='+$scope.subscriptionName).then(function(response){
            console.log('COUNT => ', response.data);
           $scope.redeliveryCount = response.data;
           if(isSharedEndpoint(subscription.deliveryMethod.endpoint)){
              $scope.isSharedEndpoint = true;
              $scope.flushRedeliveryMsgs = false;
           }
           $scope.isLoading = false;
           $scope.deleteConfirm = true;
         }, function(error){
           Notification.error({title:'Error getting messages', message:'Check the console and try again.'});
           console.error('ERROR => ' + JSON.stringify(error.data));
           $scope.isLoading = false;
         });
      };

     $scope.delete.cancel = function(){
        clean();
     }

  $scope.getSubscriptionId = function(subscription){
    var split = subscription.split("/");
    return split[split.length - 1];
  };

  function isSharedEndpoint(endpoint){
    var arrayResult = lodash.filter($scope.subscriptions, function(o) { return o.deliveryMethod.endpoint == endpoint; });
    return (arrayResult == undefined ? false : (arrayResult.length > 1 ? true : false));
  }

  $scope.hideLoading = function(){
        $scope.isLoading = false;
    }

  $scope.refresh();

}]);
