angular.module('RecopeApp.controllers')
  .controller('LoginCtrl', function($rootScope, $scope, $stateParams, LoginService) {

    $scope.login = function(data) {
      console.log(data);
    };

    LoginService.login().then($scope.login);

  });
