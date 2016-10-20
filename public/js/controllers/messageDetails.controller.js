angular.module("dgApp")

.controller('MessageDetailsCtrl',['$scope','$http', '$dataDg', 'Notification', '$location', function($scope, $http, $dataDg, Notification, $location){
    $scope.queueName = $dataDg.getAmqQueue();
    $scope.idMessage = $dataDg.getIdMessage();

    function getData(){
        $http.get('/msgdetail?queuename='+$scope.queueName+'&messageid='+$scope.idMessage.id).then(function(response){
          $scope.object = response.data;
          Notification.success({title:'Success', message:'Details loaded.'});
        }, function(error){
          Notification.error({title:'Error getting details', message:'Check the console and try again.'});
          console.error('ERROR => ' + JSON.stringify(error.data));
        });
    }

    $scope.delete = function(){
        $http.post('/deletemsg',{
              'queuename': $scope.queueName,
              'messageid': $scope.idMessage.id
            }).then(function(response){
                Notification.success({title:'Success', message: 'Message deleted.'});
                $scope.goBack();
           }, function(error){
             Notification.error({title:'Error', message:'Check the console and try again.'});
             console.error('ERROR => ' + JSON.stringify(error.data));
           });
    };

    $scope.goBack = function (){
        $location.url('/amq/messages');
    }

    getData();

}]);
