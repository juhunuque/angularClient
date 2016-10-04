angular.module('dgApp')
.factory('$dataDg', function(){
  var configs = {};
  var token = {};

  var getConfig = function(){
    return configs;
  };

  var getToken = function(){
    if(angular.equals({}, token)){
      return '';
    }
    return configs;
  };


  var setToken = function(token){
    token = this.token;
  };

  var setConfigs = function(config){
    configs = this.config;
  };

  return{
    getConfig: getConfig,
    setToken: setToken,
    setConfigs: setConfigs,
    getToken: getToken
  }
})

.factory('authInterceptor', function($dataDg) {
return {
    request: function(config) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer '+$dataDg.getToken();
      return config;
    }
  };
})
