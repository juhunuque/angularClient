angular.module("dgApp")

.controller('StatusAdminCtrl',['$scope','$http','Notification', function($scope, $http, Notification){

    function refresh(){
      $scope.title = 'Loading';
      $scope.body = 'Loading';
      $scope.isStatusFormActive = false;
    };

    $scope.toggleStatusForm = function(){
      $scope.isStatusFormActive = !$scope.isStatusFormActive;

      if(!$scope.isStatusFormActive){
        refresh();
      }
    };

    $scope.executeEndpoint = function(opt){
      switch (opt) {
          case 0:
              $scope.title = 'Root endpoint result';
              if(!$scope.isStatusFormActive){
                makeRequest('');
              }
              break;
          case 1:
              $scope.title = 'Status endpoint result';
              if(!$scope.isStatusFormActive){
                makeRequest('status');
              }
              break;
          case 2:
              $scope.title = 'Healthcheck endpoint result';
              if(!$scope.isStatusFormActive){
                makeRequest('healthcheck');
              }
              break;
          default:
              console.log('Error executing endpoint');
              break;
      }
      $scope.toggleStatusForm();
    };

    function makeRequest(endpoint){
          $http.get('/' + endpoint).then(function(response){
           $scope.body = response.data;
       }, function(error){
         Notification.error({title:'Error', message:'Check the console and try again.'});
         console.error('ERROR => ' + JSON.stringify(error.data));
       });
    };

    refresh();
}]);
