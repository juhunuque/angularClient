angular.module("dgApp")

.controller('AmqMessagesQueueCtrl',['$scope','$http', '$routeParams', 'DTOptionsBuilder', 'Notification', '$dataDg',
    function($scope, $http, $routeParams, DTOptionsBuilder, Notification, $dataDg){
  var configs = {};
  $scope.tableMsg = "Loading messages";
  $scope.queueName = $dataDg.getAmqQueue();

  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(10)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('oLanguage', {"sEmptyTable": $scope.tableMsg })
      .withOption('destroy', true)
      .withOption('autoWidth', true);

  $scope.refresh = function(){

      configs = $dataDg.getConfig();
      $scope.objects = {};
      $scope.tableMsg = "Loading messages";


      $http.get('/queuemsgs?queuename='+$scope.queueName).then(function(response){
              $scope.objects = response.data.messages;
              Notification.success({title:'Success', message:'Messages loaded.'});
              $scope.tableMsg = "No data available";
            }, function(error){
              Notification.error({title:'Error getting messages', message:'Check the console and try again.'});
              $scope.tableMsg = "Error getting messages";
              console.error('ERROR => ' + JSON.stringify(error.data));
            });
  };

  $scope.deleteMessage = function(message){
    $http.post('/deletemsg',{
          'queueName': $scope.queueName,
          'messageId': message.messageId
        }).then(function(response){
            var i = $scope.objects.indexOf(message);
            if(i != -1) {
                $scope.objects.splice(i, 1);
            }
            Notification.success({title:'Success', message: 'Message deleted.'});
       }, function(error){
         Notification.error({title:'Error', message:'Check the console and try again.'});
         console.error('ERROR => ' + JSON.stringify(error.data));
       });
  }

    $scope.refresh();

}]);
