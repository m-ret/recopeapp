angular.module('RecopeApp.services')
  .factory('LoginService', function($http) {

    function login(params) {
      $http.post('http://localhost:8880/login', {
        user: 'USRCP_HW',
        password: 'usrcp2012',
        planta: '6000',
        plangroup: 'E10',
        startDate: '2014-11-26'
      })
    };

  });
