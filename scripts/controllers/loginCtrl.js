angular.module('RecopeApp.controllers')
  .controller('LoginCtrl', function($rootScope, $scope, $stateParams) {

    $scope.credentials = {
      username: '',
      password: '',
      planta: '',
      planGroup: ''
    };

    $scope.login = function() {
      console.log('credentials', $scope.credentials);
    };

  });