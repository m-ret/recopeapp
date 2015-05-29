angular.module('RecopeApp.services', [])
  .factory('ServiceData', function($window, $http, $rootScope) {

    var declaredService = {
      getLastUpdate: $window.localStorage.getItem('lastUpdate'),
      data: JSON.parse($window.localStorage.getItem('appData')),
      syncro: syncro,
      updating: updating
    };

    return declaredService;

    function syncro() {
      console.time('ordenes');
      return $http.get('http://localhost:8880/ordenes').then(function (response) {
        $window.localStorage.setItem('lastUpdate', Date.now());
        console.log(response.data);
        $window.localStorage.setItem('appData', JSON.stringify(response.data));
        declaredService.data = response.data;
        $rootScope.$broadcast('appData:update', response.data);
      });
    }

    function updating() {
      $window.localStorage.setItem('appData', JSON.stringify(declaredService.data));
    }

  });