'use strict';
var soap = require('soap'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    moment = require('moment');

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
  crearMedicion: function(medicion) {
    return new Promise(function(fullfill, reject) {
      var soap = require('soap');
      var url = 'os_RespDocMed.wsdl';
      soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
        var documentoMedicion = {
          ORDERID: medicion.id,
          POS_ID: '',
          MEASUREMENT_POINT: medicion.id, //punto de medida, lo da el ws de consulta EQUIPO, es la liga el id
          SECONDARY_INDEX: '',
          READING_DATE: moment().format('YYYYMMDD'), //hora de que se esta tomando la medicion
          READING_TIME: moment().format('HHmmss'), //hora de que se esta tomando la medicion
          SHORT_TEXT: medicion.comentarios, //esto se escribe como sugerencia del dato
          READER: '',
          ORIGIN_INDICATOR: '',
          READING_AFTER_ACTION: '',
          RECORDED_VALUE: medicion.valorLectura, //los valores medido CUANTITATIVO
          RECORDED_UNIT: medicion.unit,   //horas en este caso esto viene del equipo CUANTITATIVO
          DIFFERENCE_READING: '',
          CODE_CATALOGUE: '1', //CODE CATALOGUE SIEMPRE EN UNO CUALITATIVO
          CODE_GROUP: (medicion.codgr === {}) ? null : medicion.codgr, //ZPM00001 SI Y SOLO SI CUALITATIVO
          VALUATION_CODE: medicion.cualitativo, // ESTE ES EL CODIGO DEL DROPDOWN
          CODE_VERSION: '',
          USER_DATA: '',
          CHECK_CUSTOM_DUPREC: '',
          WITH_DIALOG_SCREEN: '',
          PREPARE_UPDATE: '',
          COMMIT_WORK: 'X', //params del abap
          WAIT_AFTER_COMMIT: 'X', //va a continuar la ejecucion hasta que el codigo sea confirmado
          CREATE_NOTIFICATION: '',
          NOTIFICATION_TYPE: '',
          NOTIFICATION_PRIO: ''
        };
        console.log(documentoMedicion);
        client.os_RespDocMed({
          DetalleDocuMed: documentoMedicion
        }, function(err, result) {
          if(err) {
            reject(err);
          }
          fullfill(result);
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