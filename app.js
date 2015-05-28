angular
  .module('RecopeApp', [
    'ui.router',
    'ngAnimate',
    'LocalStorageModule',
    'RecopeApp.controllers',
    'RecopeApp.services',
    'RecopeApp.filters'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('orders', {
      url: '/',
      controller: 'OrdersCtrl as ordersCtrl',
      templateUrl: 'templates/ordersData.html'
    })
    .state('orders.order', {
      url: '/order/:id',
      controller: 'OrderDetailCtrl',
      templateUrl: 'templates/orderDetailTemplate.html'
    });

  $urlRouterProvider.otherwise('/');
})
