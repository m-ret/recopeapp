angular.module('RecopeApp.controllers', [])
  .controller('MainCtrl', function($scope, $window, $alert, $timeout, ServiceData) {

    $scope.dateFormat = 'dd/MM/yyyy, hh:mm a';
    $scope.getLastUpdate = ServiceData.getLastUpdate;
    $scope.online = navigator.onLine;

    $window.addEventListener('offline', $scope.isOnline, false);
    $window.addEventListener('online', $scope.isOnline, false);

    $scope.syncro = function() {
      $scope.idle = true;
      ServiceData.syncro().then(function () {
        var syncroAlert = $alert({
          animation: 'fx-bounce-right',
          content: 'Sincronización exitosa.',
          container: '.alert-container',
          type: 'info',
          duration: 2,
          show: true
        });
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
