angular.module('recope.orders', [])
  .controller('OrdersCtrl', function($rootScope, $scope, $state, dataService) {

    $scope.data   = dataService.data;
    $scope.$state = $state;
    $rootScope.$on('appData:update', updateData);

    // Update application data.
    function updateData(e, data) {
      $scope.data = data;
    }

  });

// angular.module('recope.orders', [])
//   .controller('OrdersCtrl', OrdersCtrl);

// function OrdersCtrl($rootScope, $state, dataService) {
//   var vm = this;

//   vm.data   = dataService.data;
//   vm.$state = $state;
//   $rootScope.$on('appData:update', updateData);

//   return vm;

//   // Update application data.
//   function updateData(e, data) {
//     vm.data = data;
//   }
// }
