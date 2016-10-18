angular.module("dgApp")

.controller('MessageDetailsCtrl',['$scope','$http', '$dataDg', 'Notification', function($scope, $http, $dataDg, Notification){
    $scope.queueName = $dataDg.getAmqQueue();
    $scope.idMessage = $dataDg.getIdMessage();

    function getData(){
        $http.get('/queuemsgs?queuename='+$scope.queueName).then(function(response){
          $scope.objects = response.data;
          Notification.success({title:'Success', message:'Details loaded.'});
        }, function(error){
          Notification.error({title:'Error getting details', message:'Check the console and try again.'});
          console.error('ERROR => ' + JSON.stringify(error.data));
        });
    }

}]);
