angular.module("dgApp")

.controller('AmqOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', '$dataDg', '$location',
    function($scope, $http, DTOptionsBuilder, Notification, $dataDg, $location){
  var configs = {};
  $scope.tableMsg = "Loading queues";

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
        $scope.tableMsg = "Loading queues";

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

    $scope.deleteQueue = function(queue){
        var queueName = queue.queueName;
        $http.post('/deletequeue',{
              'queuename': queueName
            }).then(function(response){
                var i = $scope.objects.indexOf(queue);
                if(i != -1) {
                    $scope.objects.splice(i, 1);
                }
                Notification.success({title:'Success', message:'Queue ' + queueName + ' deleted.'});
           }, function(error){
             Notification.error({title:'Error', message:'Check the console and try again.'});
             console.error('ERROR => ' + JSON.stringify(error.data));
           });

    }

    $scope.purgeQueue = function(queue){
        $http.post('/purgequeue',{
          'queuename': queue.queueName
        }).then(function(response){
            Notification.success({title:'Success', message:'Queue ' + queue.queueName + ' purged.'});
            queue.messageCount = 0;
       }, function(error){
         Notification.error({title:'Error', message:'Check the console and try again.'});
         console.error('ERROR => ' + JSON.stringify(error.data));
       });

    }

    $scope.goToMessages = function(queue){
        $dataDg.setAmqQueue(queue.queueName);
        $location.url('/amq/messages');
    }

    $scope.refresh();

}]);
