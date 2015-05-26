angular.module('RecopeApp.controllers', [])
  .controller('MainCtrl', function($scope, $window, ServiceData) {

    $scope.dateFormat = 'dd/MM/yyyy, hh:mm a';
    $scope.getLastUpdate = ServiceData.getLastUpdate;
    $scope.online = navigator.onLine;

    $window.addEventListener('offline', $scope.isOnline, false);
    $window.addEventListener('online', $scope.isOnline, false);

    $scope.syncro = function() {
      $scope.idle = true;
      ServiceData.syncro().then(function () {
        $scope.idle = false;
        $scope.showSync = false;
        $scope.getLastUpdate = Date.now();
      }, function(err) {
        console.log(err);
      });
    }

    $scope.isOnline = function() {
      $scope.$apply(function () {
        $scope.online = navigator.online;
        console.log($scope.online);
      });
    }
  });
