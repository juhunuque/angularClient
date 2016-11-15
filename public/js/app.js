var app = angular.module('dgApp',['ngRoute', 'ngAnimate', 'ui-notification', 'datatables', 'angular-spinkit', 'ngLodash','highcharts-ng']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){


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
.when('/amq',{
    templateUrl: 'js/html/amqOperations.view.html',
    controller: 'AmqOperationsCtrl'
})
.when('/amq/messages',{
    templateUrl: 'js/html/amqMessagesQueue.view.html',
    controller: 'AmqMessagesQueueCtrl'
})
.when('/amq/messages/details',{
    templateUrl: 'js/html/messageDetails.view.html',
    controller: 'MessageDetailsCtrl'
})
.when('/subscription',{
    templateUrl: 'js/html/subscriptionOperations.view.html',
    controller: 'SubscriptionOperationsCtrl'
})
.when('/runTests',{
    templateUrl: 'js/html/runTests.view.html',
    controller: 'RunTestsCtrl'
})
.when('/internalEnv',{
    templateUrl: 'js/html/internalEnvironment.view.html',
    controller: 'InternalEnvCtrl'
})
.when('/internalMetrics',{
    templateUrl: 'js/html/internalMetrics.view.html',
    controller: 'InternalMetricCtrl'
})
.otherwise({redirectTo: 'home'});

}
]);

app.run(function ($rootScope, $location, $http, $dataDg) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(angular.equals($dataDg.getConfig(), {})){
            $http.get('/config').then(function(response){
                    $dataDg.setConfigs(response.data);
                  }, function(error){
                    console.error('ERROR GETTING CONFIGS => ' + JSON.stringify(error.data));
                  });
        }
    });

  });
