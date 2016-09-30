var app = angular.module('dgApp',['ngRoute','ngAnimate']);

app.config(['$routeProvider',function($routeProvider){

  $routeProvider
.when('/home',{
    templateUrl: 'views/home.view.html',
    controller: 'HomeCtrl'
})
.when('/statusES',{
    templateUrl: 'views/statusES.view.html',
    controller: 'StatusESCtrl'
})
.otherwise({redirectTo: 'home'})
}
]);
