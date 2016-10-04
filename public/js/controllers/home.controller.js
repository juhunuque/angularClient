angular.module("dgApp")

.controller('HomeCtrl',['$scope','$http','$dataDg', function($scope, $http, $dataDg){
    console.log('HomeCtrl Init...');
    $dataDg.requestConfig();

}]);
