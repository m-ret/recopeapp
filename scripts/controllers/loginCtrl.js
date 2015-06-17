angular.module('RecopeApp.controllers')
  .controller('LoginCtrl', function($rootScope, $scope, $stateParams, LoginService) {

    $scope.params = {
      user: '',
      password: '',
      planta: '',
      plangroup: ''
    };

    $scope.login = function() {
      LoginService.login($scope.params).then(function(params) {
        console.log('credentials', $scope.params, params);
      })
    };

  });
