angular
  .module('recope', [
    'ui.router',
    'ngAnimate',
    'LocalStorageModule',
    'recope.orders',
    'recope.order'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/orders');

  $stateProvider
    .state('orders', {
      url         : '/orders',
      controller  : 'OrdersController as orders',
      templateUrl : './components/orders/orders.html'
    })
    .state('orders.order', {
      url         : '/:id',
      controller  : 'OrderController as order',
      templateUrl : './components/order/order.html'
    });

    $urlRouterProvider.otherwise('/orders');
})


.controller('AppController', function($scope, $window, dataService) {
  var vm = this;

  vm.dateFormat    = 'dd/MM/yyyy, hh:mm a';
  vm.appLastUpdate = dataService.lastUpdate;
  vm.sync          = sync;
  vm.online        = navigator.onLine;

  $window.addEventListener('offline', detectConnection, false);
  $window.addEventListener('online', detectConnection, false);

  return vm;

  function sync() {
    vm.idle = true;
    dataService
      .sync()
      .then(function () {
        vm.idle = false;
        vm.showSync = false;
        vm.appLastUpdate = Date.now();
      });
  }

  function detectConnection() {
    $scope.$apply(function () {
      vm.online = navigator.online;
    });
  }
});
