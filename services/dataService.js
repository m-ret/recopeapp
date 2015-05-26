angular.module('recope')
  .factory('dataService', function($window, $http, $rootScope) {

    var service = {
      lastUpdate: $window.localStorage.getItem('lastUpdate'),
      data: JSON.parse($window.localStorage.getItem('appData')),
      sync: sync,
      update: update
    };

    return service;

    function sync() {
      return $http.get('appData.json').then(function (response) {
        $window.localStorage.setItem('lastUpdate', Date.now());
        $window.localStorage.setItem('appData', JSON.stringify(response.data));
        service.data = response.data;
        $rootScope.$broadcast('appData:update', response.data);
      });
    }

    function update() {
      $window.localStorage.setItem('appData', JSON.stringify(service.data));
    }

  });
//   angular
//   .module('recope')
//   .factory('dataService', dataService);

// function dataService($window, $http, $rootScope) {
//   var service = {
//     lastUpdate : $window.localStorage.getItem('lastUpdate'),
//     data       : JSON.parse($window.localStorage.getItem('appData')),
//     sync       : sync,
//     update     : update
//   };

//   return service;

//   function sync() {
//     return $http
//       .get('appData.json')
//       .then(function (response) {
//         $window.localStorage.setItem('lastUpdate', Date.now());
//         $window.localStorage.setItem('appData', JSON.stringify(response.data));
//         service.data = response.data;
//         $rootScope.$broadcast('appData:update', response.data);
//       });
//   }

//   function update() {
//     $window.localStorage.setItem('appData', JSON.stringify(service.data));
//   }
// }

