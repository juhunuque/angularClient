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
          objects.push({key: (header == null ? '' : header + '.') + i, value: json[i]});
        }
    }
    return objects;
  }

  var levenshteinDistance = function(a, b){
    if(a.length == 0) return b.length;
    if(b.length == 0) return a.length;

    var matrix = [];

    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }

    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }

    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
                                  Math.min(matrix[i][j-1] + 1,
                                           matrix[i-1][j] + 1));
        }
      }
    }

    return matrix[b.length][a.length];
  };

  return{
    jsonToArray: jsonToArray,
    levenshteinDistance: levenshteinDistance
  }
})
