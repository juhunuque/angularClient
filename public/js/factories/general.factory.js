angular.module('dgApp')
.factory('$dataDg', function($http){
  var configs = {};

  var getConfig = function(){
    if(angular.equals({}, configs)){
      requestConfig();
    }
    return configs;
  };

  var requestConfig = function(){
    $http.get('/config').then(function(response){
     configs = response.data;
   }, function(error){
     console.error('ERROR GETTING CONFIGS => ' + JSON.stringify(error.data));
   });

  };

  return{
    getConfig: getConfig,
    requestConfig: requestConfig
  }
})
