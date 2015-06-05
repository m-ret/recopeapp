'use strict';
var soap = require('soap'),
    _ = require('lodash'),
    Promise = require('bluebird');

module.exports = {
  /*  COD_GR si es vacio es = CUANTITATVO
   *  si viene COD_GR lleno es CUALITATIVO, ahi lo que hay que hacer es, tener dos campos uno,
   *  un dropdown con los valores que devuelve la consulta de zpm, cons_cod_val, esa consulta
   *  te retorna una serie de registros un listado de valores, ese
   *  drowpdown deberia de contener cons_cod_val, y un campo de texto para la informacion
   *  Y e el otro tipo lleva un valor y el campo de texto
   *  KURZ_TXT_CD, enviar CODE
   * */
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
              //console.log(puntoMedida);
              puntosMedida.push({
                id: puntoMedida.POINT,
                label: puntoMedida.PTTXT,
                value: puntoMedida.DECIM,
                codgr: puntoMedida.CODGR,
                unit: puntoMedida.MRNGU,
                unitDesc: puntoMedida.ATNAM
              });
            });
            fullfill(puntosMedida);
          }
        });
      });
    });
  },
  buscarDatosCualitativos: function() {
    return new Promise(function(fullfill, reject) {
      var soap = require('soap');
      var url = 'os_ConsCodVal.wsdl';
      soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
        client.os_ConsCodVal({
          CodGrupos: {
            CodGrupo: 'ZPM00001'
          }
        }, function(err, datosCualitativos) {
          if (err) {
            reject({
              err:err
            });
          }
          console.log(datosCualitativos);
          fullfill(_.map(datosCualitativos.DetCodVal, function(datoCualitativo) {
            return {
              code: datoCualitativo.CODE,
              texto: datoCualitativo.KURZTEXTCD
            }
          }));
        });
      });
    });
  }
};