angular.module("dgApp")

.controller('InternalDumpCtrl',['$scope','$http','$dataDg', 'Notification', 'DTOptionsBuilder', '$utils', function($scope, $http, $dataDg, Notification, DTOptionsBuilder, $utils){

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
    $scope.inNativeQty = 0;
    $scope.noNativeQty = 0;
    $scope.threadChart = [];
    $scope.isLoading = false;
  };

  $scope.toggleStatusForm = function(){
    $scope.isStatusFormActive = !$scope.isStatusFormActive;

    if(!$scope.isStatusFormActive){
      refresh();
    }else{
        $scope.isLoading = true;
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
      var endpoint = '/dump'
      $http.post('/routeget',{
      'url': url + endpoint
      }).then(function(response){
          var processedData = processData(response.data, [], existsInList);
          $scope.objects = buildTableArray(processedData);
          buildBarChart(processedData, response.data.length);

          Notification.success({title:'Success', message:'Data loaded.'});
          $scope.isLoading = false;
        }, function(error){
          Notification.error({title:'Error', message:'Check the console and try again.'});
          console.error('ERROR => ' + JSON.stringify(error.data));
          $scope.isLoading = false;
        });
  };

  function processData(array, objects,func){
      var inNative = 0;
      var noNative = 0;
      array.map(function(object,index){
        var item = object.threadName.substring(0,15);
        if(object.inNative){
          inNative++;
        }else{
          noNative++;
        }
        var result = func.apply(this,[objects, item]);
        if(!result){
          objects[item] = 1;
        }else{
          objects[result] = objects[result] + 1;
        }
      })
      $scope.inNativeQty = inNative;
      $scope.noNativeQty = noNative;
      return objects;
    }

    function existsInList(list, element){
        for(var i in list){
          if($utils.levenshteinDistance(i, element)<2){
            return i;
          }
        }
        return false;
      }

  function buildTableArray(dataArray){
    var objects = [];
    var keys = Object.keys(dataArray);
    keys.map(function(object, index){
      objects.push({key: object, value: dataArray[object]});
    })
    return objects;
  }


function buildBarChart(dataArray, totalThreads){
  $scope.threadChart.labels = [];
  $scope.threadChart.data = [];
  var keys = Object.keys(dataArray);
  keys.map(function(object, index){
    $scope.threadChart.labels.push(object);
    $scope.threadChart.data.push(dataArray[object]);

  })

  $scope.threadChart.options = {
    title: {
     display: true,
     fontSize: 14,
     text: 'Total Threads: ' + totalThreads
   }
 };
}

refresh();
}]);
