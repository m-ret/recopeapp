angular.module('RecopeApp.controllers')
  .controller('OrdersCtrl', function($rootScope, $state, ServiceData) {

    var _this = this;

    _this.data = ServiceData.data;
    _this.$state = $state;
    $rootScope.$on('appData:update', updateData);

    return _this;

    function updateData(event, data) {
      _this.data = data;
    }

  });

