angular.module('RecopeApp.controllers')
  .controller('OrderDetailCtrl', function($rootScope, $scope, $stateParams, ServiceData) {

    $scope.operations = [];
    $scope.cualitativos = ServiceData.cualitativos;
    console.log($scope.cualitativos);

    $scope.statuses = {
      0: 'Sin comenzar',
      1: 'Iniciada',
      2: 'Pausada',
      3: 'Terminada'
    }

    $scope.data = getWorkingOrder(ServiceData.data);
    $scope.timeFormatter = timeFormatter;
    $rootScope.$on('appData:update', updateData);

    function updateData(e, data) {
      $scope.data = getWorkingOrder(data);
    }

    function getWorkingOrder(data) {
      var response;

      _.filter(data, function(order) {
        if ($stateParams.id == order.id) {
          response = order;
          console.log(response);
        }
      })
      return response;
    }

    function timeFormatter(seconds) {
      var hours   = Math.floor(seconds / 3600),
          minutes = Math.ceil((seconds - (hours * 3600)) / 60),
          total  = '';

      if (hours) {
        total += hours + ' hora';
        if (hours > 1) total += 's';
        total += ' ';
      }

      if (minutes) {
        total += minutes + ' minuto';
        if (minutes > 1) total += 's';
      }

      return total;
    }

    $scope.startOperation = function(operation) {
      var operation = $scope.data.operations[$scope.data.operations.indexOf(operation)];

      operation.lastStart = Date.now();
      operation.playing = true;
      operation.status = 1;
      ServiceData.updating();
    }

    $scope.pauseOperation = function(operation) {
      var operation = $scope.data.operations[$scope.data.operations.indexOf(operation)];

      if (!operation.start) {
        operation.start = operation.lastStart;
      }

      operation.end = Date.now();
      operation.playing = false;
      operation.status = 2;
      operation.partialTime = operation.partialTime || 0;
      operation.partialTime += Math.ceil((operation.end - operation.lastStart) / 1000);
      ServiceData.updating();
    }

    $scope.finishOperation = function(operation) {
      var operation = $scope.data.operations[$scope.data.operations.indexOf(operation)];
      operation.status = 3;
      ServiceData.finishOperation(operation);
    }

  });

