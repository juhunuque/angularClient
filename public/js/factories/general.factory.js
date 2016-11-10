angular.module('dgApp')
.factory('$dataDg', function(){
  var configs = {};
  var amqQueue = {};
  var idMessage = {};

  var setIdMessage = function(id){
    idMessage = id;
  };

  var getIdMessage = function(){
    return idMessage;
  };

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
    setAmqQueue: setAmqQueue,
    setIdMessage: setIdMessage,
    getIdMessage: getIdMessage
  }
})

.factory('$utils', function(){
  var jsonToArray = function(json, header, objects){
    for (var i in json) {
        if (!!json[i] && typeof(json[i])=="object") {
            jsonToArray(json[i],i, objects);
        }else{
          objects.push({key: header + '.' + i, value: json[i]});
        }
    }
    return objects;
  }

  return{
    jsonToArray: jsonToArray
  }
})
