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
      return $http.get('dummydata.json').then(function (response) {
        $window.localStorage.setItem('lastUpdate', Date.now());
        $window.localStorage.setItem('appData', JSON.stringify(response.data));
        declaredService.data = response.data;
        $rootScope.$broadcast('appData:update', response.data);
      });
    }

    function updating() {
      $window.localStorage.setItem('appData', JSON.stringify(declaredService.data));
    }

  });

