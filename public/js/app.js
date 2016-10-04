var app = angular.module('dgApp',['ngRoute','ngAnimate','ui-notification']);

app.config(['$routeProvider', '$httpProvider',function($routeProvider, $httpProvider){

  $httpProvider.interceptors.push('authInterceptor');

  $routeProvider
.when('/home',{
    templateUrl: 'js/html/home.view.html',
    controller: 'HomeCtrl'
})
.when('/statusES',{
    templateUrl: 'js/html/statusES.view.html',
    controller: 'StatusESCtrl'
})
.when('/statusAdmin',{
    templateUrl: 'js/html/statusAdmin.view.html',
    controller: 'StatusAdminCtrl'
})
.when('/statusCP',{
    templateUrl: 'js/html/statusCP.view.html',
    controller: 'StatusCPCtrl'
})
.when('/statusMonitor',{
    templateUrl: 'js/html/statusMonitor.view.html',
    controller: 'StatusMonitorCtrl'
})
.otherwise({redirectTo: 'home'})
}
]);

app.run(function ($rootScope, $location, $http, $dataDg) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
      // $dataDg.requestConfig();
      // $dataDg.requestToken();
        $http.get('/gettoken').then(function(response){
          $dataDg.setToken(response.data)
       }, function(error){
         console.error('ERROR GETTING TOKEN => ' + JSON.stringify(error.data));
       });

       $http.get('/config').then(function(response){
        $dataDg.setConfigs(response.data)
      }, function(error){
        console.error('ERROR GETTING CONFIGS => ' + JSON.stringify(error.data));
      });
    });
  });
