angular.module('dgApp')
.factory('$dataDg', function(){
  var configs = {};

  var getConfig = function(){
    return configs;
  };

  var setConfigs = function(config){
    configs = config;
  };

  return{
    getConfig: getConfig,
    setConfigs: setConfigs
  }
})


