angular.module("dgApp")

.controller('AmqMessagesQueueCtrl',['$scope','$http', '$routeParams', 'DTOptionsBuilder', 'Notification', '$dataDg', '$location',
    function($scope, $http, $routeParams, DTOptionsBuilder, Notification, $dataDg, $location){
  var configs = {};
  $scope.queueName = $dataDg.getAmqQueue();

  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(10)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('oLanguage', {"sEmptyTable": "No data available" })
      .withOption('destroy', true)
      .withOption('autoWidth', true);

  $scope.refresh = function(){

      configs = $dataDg.getConfig();
      $scope.objects = {};
      $scope.isLoading = true;
      $scope.loadingMsg = 'Loading messages';

      $http.get('/queuemsgs?queuename='+$scope.queueName).then(function(response){
          $scope.objects = response.data.messages;
          Notification.success({title:'Success', message:'Messages loaded.'});
          $scope.isLoading = false;
        }, function(error){
          Notification.error({title:'Error getting messages', message:'Check the console and try again.'});
          console.error('ERROR => ' + JSON.stringify(error.data));
          $scope.isLoading = false;
        });
  };

  $scope.deleteMessage = function(message){
    $scope.loadingMsg = 'Removing message.';
    $scope.isLoading = true;
    $http.post('/deletemsg',{
          'queuename': $scope.queueName,
          'messageid': message.values.messageId
        }).then(function(response){
            var i = $scope.objects.indexOf(message);
            if(i != -1) {
                $scope.objects.splice(i, 1);
            }
            Notification.success({title:'Success', message: 'Message deleted.'});
            $scope.isLoading = false;
       }, function(error){
         Notification.error({title:'Error', message:'Check the console and try again.'});
         console.error('ERROR => ' + JSON.stringify(error.data));
         $scope.isLoading = false;
       });
  }

  $scope.goToDetails = function(message){
    $dataDg.setIdMessage({id:message.values.messageId, guid: message.values.guid});
    $location.url('/amq/messages/details');
  }

  $scope.hideLoading = function(){
      $scope.isLoading = false;
  }

    $scope.refresh();

}]);
