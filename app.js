angular
  .module('RecopeApp', [
    'ui.router',
    'ngAnimate',
    'mgcrea.ngStrap',
    'LocalStorageModule',
    'RecopeApp.controllers',
    'RecopeApp.services',
    'RecopeApp.filters',
    'RecopeApp.directives'
  ])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('orders', {
      url: '/',
      controller: 'OrdersCtrl as ordersCtrl',
      templateUrl: 'templates/ordersData.html'
    })
    .state('orders.order', {
      url: ':id',
      controller: 'OrderDetailCtrl',
      templateUrl: 'templates/orderDetailTemplate.html'
    });

  $urlRouterProvider.otherwise('/');
})
