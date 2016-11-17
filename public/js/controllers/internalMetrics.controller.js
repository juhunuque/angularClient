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

      $scope.memory = [];
      $scope.heap = [];
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
           buildMemChart(response.data["mem.free"], (response.data.mem-response.data["mem.free"]), response.data.mem);
           buildHeapChart((response.data.heap-response.data["heap.used"]),response.data["heap.used"], response.data.heap);

            Notification.success({title:'Success', message:'Data loaded.'});
          }, function(error){
            Notification.error({title:'Error', message:'Check the console and try again.'});
            console.error('ERROR => ' + JSON.stringify(error.data));
          });
    };

    function buildMemChart(free, used, total){
      $scope.memory.labels = ["Free", "Used"];
      $scope.memory.chartColors = ['#7CB5EC', '#434348'];
      $scope.memory.data = [free, used];
      $scope.memory.options = {
        title: {
         display: true,
         fontSize: 14,
         text: 'Total memory: ' + total
       },
       legend: {
           display: true,
           position: 'bottom'
       }
     };
    }

    function buildHeapChart(free, used, total){
      $scope.heap.labels = ["Free", "Used"];
      $scope.heap.chartColors = ['#7CB5EC', '#434348'];
      $scope.heap.data = [free, used];
      $scope.heap.options = {
        title: {
         display: true,
         fontSize: 14,
         text: 'Total heap: ' + total
       },
       legend: {
           display: true,
           position: 'bottom'
       }
     };
    }

    refresh();
}]);
