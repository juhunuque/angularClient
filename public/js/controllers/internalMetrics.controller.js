angular.module("dgApp")

.controller('InternalMetricCtrl',['$scope','$http','$dataDg', 'Notification', 'DTOptionsBuilder', '$utils', function($scope, $http, $dataDg, Notification, DTOptionsBuilder, $utils){

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(50)
        .withOption('bLengthChange', false)
        .withOption('destroy', true)
        .withOption('autoWidth', true)
        .withOption('oLanguage', {"sEmptyTable": "No data available" });

    var configs = {};
    function refresh(){
      $scope.objects = {};
      $scope.title = '';
      $scope.isStatusFormActive = false;
      configs = $dataDg.getConfig();
    };


    $scope.toggleStatusForm = function(){
      $scope.isStatusFormActive = !$scope.isStatusFormActive;

      if(!$scope.isStatusFormActive){
        refresh();
      }
    };

    $scope.executeEndpoint = function(opt){
      switch (opt) {
          case 0:
              $scope.title = 'Event Service';
              if(!$scope.isStatusFormActive){
                makeRequest(configs.eventService);
              }
              break;
          case 1:
              $scope.title = 'Consumer Proxy';
              if(!$scope.isStatusFormActive){
                makeRequest(configs.eventServiceConsumerProxy);
              }
              break;
          case 2:
              $scope.title = 'Monitor';
              if(!$scope.isStatusFormActive){
                makeRequest(configs.eventServiceMonitor);
              }
              break;
          default:
              console.log('Error executing endpoint');
              break;
      }
      $scope.toggleStatusForm();
    };

    function makeRequest(url){
        var endpoint = '/metrics'
        $http.post('/routeget',{
        'url': url + endpoint
        }).then(function(response){
            $scope.objects = $utils.jsonToArray(response.data,null,[]);
            makeChart(100, 200);
            Notification.success({title:'Success', message:'Data loaded.'});
          }, function(error){
            Notification.error({title:'Error', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
          });
    };

    function makeChart(freeMem, totalMem){
        $scope.chartConfig = {
          options: {
              chart: {
                  type: 'pie'
              }
          },
          series: [{
            name: 'Memory',
              data: [{
                name: 'Used',
                y: totalMem - freeMem
              },{
                name: 'Free',
                y: freeMem,
                sliced: true
              }]
          }],
          title: {
              text: 'Memory usage'
          },
          subtitle:{
            text: 'Total Memory: ' + totalMem
          },

          loading: false
      }
    }


    refresh();
}]);
