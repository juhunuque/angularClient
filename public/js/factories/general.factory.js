angular.module('dgApp')
.factory('$dataDg', function(){
  var configs = {};
  var amqQueue = {}

  var getAmqQueue = function(){
    return amqQueue;
  };

  var setAmqQueue = function(queue){
    amqQueue = queue;
  }

  var getConfig = function(){
    return configs;
  };

  var setConfigs = function(config){
    configs = config;
  };

  return{
    getConfig: getConfig,
    setConfigs: setConfigs,
    getAmqQueue: getAmqQueue,
    setAmqQueue: setAmqQueue
  }
})


