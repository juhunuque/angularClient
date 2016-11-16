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
            $scope.chartMemConfig = buildPieChart(response.data["mem.free"], (response.data.mem-response.data["mem.free"]), response.data.mem, {
                title: 'Memory usage',
                subtitle: 'Total memory: ',
                seriesName: 'Memory'
            });

            $scope.chartHeapConfig = buildPieChart((response.data.heap-response.data["heap.used"]),response.data["heap.used"], response.data.heap, {
                 title: 'Heap usage',
                 subtitle: 'Total heap: ',
                 seriesName: 'Heap'
             });

            Notification.success({title:'Success', message:'Data loaded.'});
          }, function(error){
            Notification.error({title:'Error', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
          });
    };

    function buildPieChart(freeMem, usedMem, totalMem, text){
        var chart = {
          options: {
              chart: {
                  type: 'pie'
              }
          },
          series: [{
            name: text.seriesName,
              data: [{
                name: 'Used',
                y: usedMem
              },{
                name: 'Free',
                y: freeMem,
                sliced: true
              }]
          }],
          title: {
              text: text.title
          },
          subtitle:{
            text: text.subtitle + totalMem
          },

          loading: false
      };

      return chart;
    }


    refresh();
}]);
