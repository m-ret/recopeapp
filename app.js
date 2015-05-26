angular
  .module('recope', [
    'ui.router',
    'ngAnimate',
    'LocalStorageModule',
    'recope.controllers',
    'recope.orders',
    'recope.order'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/orders');

  $stateProvider
    .state('orders', {
      url         : '/orders',
      controller  : 'OrdersCtrl as orders',
      templateUrl : './components/orders/orders.html'
    })
    .state('orders.order', {
      url         : '/:id',
      controller  : 'OrderDetailCtrl',
      templateUrl : './components/order/order.html'
    });

    $urlRouterProvider.otherwise('/orders');
})
