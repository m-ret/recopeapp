angular
  .module('recope.order', [])
  .controller('OrderController', OrderController);

function OrderController($rootScope, dataService, $stateParams) {
  var vm = this;

  vm.statuses = {
    0 : 'Sin comenzar',
    1 : 'Iniciada',
    2 : 'Pausada',
    3 : 'Terminada'
  }

  vm.data              = _findCurrentOrder(dataService.data);
  vm.toHoursAndMinutes = toHoursAndMinutes;
  vm.startOperation    = startOperation;
  vm.pauseOperation    = pauseOperation;
  vm.finishOperation   = finishOperation;
  $rootScope.$on('appData:update', updateData);

  return vm;

  // Update application data.
  function updateData(e, data) {
    vm.data = _findCurrentOrder(data);
  }

  // Find the current order.
  function _findCurrentOrder(data) {
    var response;

    for (var i in data) {
      var order = data[i];

      if ($stateParams.id == order.id) {
        response = order;
        break;
      }
    }

    return response;
  }

  // Convert seconds to hours and minutes.
  function toHoursAndMinutes(seconds) {
    var hours   = Math.floor(seconds / 3600)
      , minutes = Math.ceil((seconds - (hours * 3600)) / 60)
      , result  = '';

    if (hours) {
      result += hours + ' hora';
      if (hours > 1) result += 's';
      result += ' ';
    }

    if (minutes) {
      result += minutes + ' minuto';
      if (minutes > 1) result += 's';
    }

    return result;
  }

  // Start an operation timer.
  function startOperation(operation) {
    var operation = vm.data.operations[vm.data.operations.indexOf(operation)];

    operation.lastStart = Date.now();
    operation.playing = true;
    operation.status = 1;
    dataService.update();
  }

  // Pause an operation timer.
  function pauseOperation(operation) {
    var operation = vm.data.operations[vm.data.operations.indexOf(operation)];

    if (!operation.start) {
      operation.start = operation.lastStart;
    }

    operation.end = Date.now();
    operation.playing = false;
    operation.status = 2;

    // Sumarize the transcurred seconds.
    operation.partialTime = operation.partialTime || 0;
    operation.partialTime += Math.ceil((operation.end - operation.lastStart) / 1000);
    dataService.update();
  }

  // Finish an operation.
  function finishOperation(operation) {
    var operation = vm.data.operations[vm.data.operations.indexOf(operation)];
    operation.status = 3;
    dataService.update();
  }
}
