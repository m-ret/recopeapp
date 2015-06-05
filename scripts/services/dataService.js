angular.module('RecopeApp.services', [])
  .factory('ServiceData', function($window, $http, $rootScope) {

    var declaredService = {
      getLastUpdate: $window.localStorage.getItem('lastUpdate'),
      data: JSON.parse($window.localStorage.getItem('appData')),
      cualitativos: JSON.parse($window.localStorage.getItem('cualitativos')),
      syncro: syncro,
      updating: updating,
      finishOperation: function(operation) {
        $http.post('http://localhost:8880/crearOrden', {
          order: operation.orderId,
          operation: operation.actividad,
          title: operation.title,
          start: operation.start,
          end: operation.end,
          mediciones: operation.mediciones
        }).then(function (response) {
          this.updating();
        }.bind(this), function(err) {
          console.log(err);
        });
      }
    };

    return declaredService;

    function syncro() {
      console.time('ordenes');
      return $http.get('http://localhost:8880/ordenes').then(function (response) {
        $window.localStorage.setItem('lastUpdate', Date.now());
        $window.localStorage.setItem('appData', JSON.stringify(response.data.ordenes));
        $window.localStorage.setItem('cualitativos', JSON.stringify(response.data.cualitativos));
        declaredService.data = response.data;
        $rootScope.$broadcast('appData:update', response.data.ordenes);
      });
    }

    function updating() {
      $window.localStorage.setItem('appData', JSON.stringify(declaredService.data));
    }

  });