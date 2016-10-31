angular.module("dgApp")

.controller('AmqOperationsCtrl',['$scope','$http', 'DTOptionsBuilder', 'Notification', '$dataDg', '$location',
    function($scope, $http, DTOptionsBuilder, Notification, $dataDg, $location){
  var configs = {};
  var selectedQueue = {};

  $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(50)
      .withOption('bLengthChange', false)
      .withOption('scrollY', "500px")
      .withOption('scrollCollapse', true)
      .withOption('oLanguage', {"sEmptyTable": "No data available" })
      .withOption('destroy', true)
      .withOption('autoWidth', true);

    $scope.clean = function(){
        $scope.deleteConfirm = false;
        $scope.purgeConfirm = false;
    }

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

    $scope.deleteQueue = function(){
        var queueName = selectedQueue.queueName;
        $scope.loadingMsg = 'Removing ' + queueName;
        $scope.isLoading = true;
        console.log('QQ ',queueName);
        $http.post('/deletequeue',{
              'queuename': queueName
            }).then(function(response){
                console.log(response);
                var i = $scope.objects.indexOf(selectedQueue);
                if(i != -1) {
                    $scope.objects.splice(i, 1);
                }
                Notification.success({title:'Success', message:'Queue ' + queueName + ' deleted.'});
                $scope.isLoading = false;
                $scope.clean();
           }, function(error){
             Notification.error({title:'Error', message:'Check the console and try again.'});
             console.error('ERROR => ' + JSON.stringify(error.data));
             $scope.isLoading = false;
             $scope.clean();
           });
    }

    $scope.deleteQueue.confirm = function(queue){
        selectedQueue = queue;
        $scope.queueName = queue.queueName;
        $scope.deleteConfirm = true;
    }

    $scope.purgeQueue = function(){
        $http.post('/purgequeue',{
          'queuename': selectedQueue.queueName
        }).then(function(response){
            Notification.success({title:'Success', message:'Queue ' + selectedQueue.queueName + ' purged.'});
            selectedQueue.messageCount = 0;
            $scope.clean();
       }, function(error){
         Notification.error({title:'Error', message:'Check the console and try again.'});
         console.error('ERROR => ' + JSON.stringify(error.data));
         $scope.clean();
       });

    }

    $scope.purgeQueue.confirm = function(queue){
        selectedQueue = queue;
        $scope.queueName = queue.queueName;
        $scope.purgeConfirm = true;
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
