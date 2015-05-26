angular.module('recope.controllers', [])
  .controller('MainCtrl', function($scope, $window, dataService) {

    $scope.dateFormat = 'dd/MM/yyyy, hh:mm a';
    $scope.appLastUpdate = dataService.lastUpdate;
    $scope.online = navigator.onLine;

    $window.addEventListener('offline', $scope.isOnline, false);
    $window.addEventListener('online', $scope.isOnline, false);

    $scope.sync = function() {
      $scope.idle = true;
      dataService.sync().then(function () {
        $scope.idle = false;
        $scope.showSync = false;
        $scope.appLastUpdate = Date.now();
      });
    }

    $scope.isOnline = function() {
      $scope.$apply(function () {
        $scope.online = navigator.online;
        console.log($scope.online);
      });
    }
  });
