var app = angular.module('dgApp',['ngRoute','ngAnimate']);

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
.otherwise({redirectTo: 'home'})
}
]);
