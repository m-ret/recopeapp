angular.module('RecopeApp.services')
  .factory('LoginService', function($http, $q) {

    return {
      login: function () {
        return $http.post('http://localhost:8000/login', {
          user: 'USRCP_HW',
          password: 'usrcp2012',
          planta: '6000',
          plantroup: 'E10',
          startDate: '2014-11-26'
        }).success(function (data) {
          console.log(data);
        }).error(function (data, status) {
          console.log(data, status);
        });
      }
    }
  });
