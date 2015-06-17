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
    .state('login', {
        url: '/',
        controller: 'loginCtrl',
        templateUrl: 'templates/login.html'
      })
    .state('orders', {
      url: '/orders',
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
