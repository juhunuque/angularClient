angular.module("dgApp")

.controller('AmqOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', '$dataDg', '$location',
    function($scope, $http, DTOptionsBuilder, Notification, $dataDg, $location){
  var configs = {};

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
        $scope.loadingMsg = 'Loading queues';

        $http.get('/queuelist').then(function(response){
                $scope.objects = response.data.queues;
                Notification.success({title:'Success', message:'Queues loaded.'});
                $scope.isLoading = false;
              }, function(error){
                Notification.error({title:'Error getting queues', message:'Check the console and try again.'});
                console.error('ERROR => ' + JSON.stringify(error.data));
                $scope.isLoading = false;
              });
    };

    $scope.deleteQueue = function(queue){
        var queueName = queue.queueName;
        $scope.loadingMsg = 'Removing ' + queueName;
        $scope.isLoading = true;
        $http.post('/deletequeue',{
              'queuename': queueName
            }).then(function(response){
                var i = $scope.objects.indexOf(queue);
                if(i != -1) {
                    $scope.objects.splice(i, 1);
                }
                Notification.success({title:'Success', message:'Queue ' + queueName + ' deleted.'});
                $scope.isLoading = false;
           }, function(error){
             Notification.error({title:'Error', message:'Check the console and try again.'});
             console.error('ERROR => ' + JSON.stringify(error.data));
             $scope.isLoading = false;
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

    $scope.hideLoading = function(){
        $scope.isLoading = false;
    }

    $scope.refresh();

}]);
