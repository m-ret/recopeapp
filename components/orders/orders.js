angular
  .module('recope.orders', [])
  .controller('OrdersController', OrdersController);

function OrdersController($rootScope, $state, dataService) {
  var vm = this;

  vm.data   = dataService.data;
  vm.$state = $state;
  $rootScope.$on('appData:update', updateData);

  return vm;

  // Update application data.
  function updateData(e, data) {
    vm.data = data;
  }
}
