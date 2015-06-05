'use strict';
var soap = require('soap'),
    _ = require('lodash'),
    Promise = require('bluebird');

module.exports = {
  buscarMedicion: function(numeroEquipo) {
    return new Promise(function(fullfill, reject) {
      var url = 'os_ConsPtosMed.wsdl';
      soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
        client.os_ConsPtosMed({
          Equipos: {
            Equipo: numeroEquipo
          }
        }, function(err, result) {
          if (err) {
            reject(err);
          } else {
            var puntosMedida = [];
            _.each(result.DetPtosMedida, function(puntoMedida){
              puntosMedida.push({
                label: puntoMedida.PTTXT,
                value: parseInt(puntoMedida.POINT, 10)
              });
            });
            setTimeout(function() {
              console.log('enviando puntos de medida');
              fullfill(puntosMedida);
            }, 2000);
          }
        });
      });
    });
  }
};