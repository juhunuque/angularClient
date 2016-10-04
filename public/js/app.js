var app = angular.module('dgApp',['ngRoute','ngAnimate','ui-notification']);

app.config(['$routeProvider',function($routeProvider){

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
