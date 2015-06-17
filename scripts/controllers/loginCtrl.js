angular.module('RecopeApp.controllers')
  .controller('LoginCtrl', function($rootScope, $scope, $stateParams, LoginService) {

    $scope.params = {
      username: '',
      password: '',
      planta: '',
      planGroup: ''
    };

    $scope.login = function() {
      LoginService.login($scope.params).then(function() {
        console.log('credentials', $scope.params);
      })
    };

  });
