var Hapi = require('hapi'),
    _ = require('lodash'),
    recopeFunciones = require('./recope-funciones.js'),
    async = require('async');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 8880,
  routes: { cors: true }
});
// Add the route
server.route({
  method: 'GET',
  path: '/respDocMed',
  handler: function(request, reply) {
    var soap = require('soap');
    var url = 'os_RespDocMed.wsdl';
    soap.createClient(url, function(err, client) {
      client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
      client.os_RespDocMed({
        DetalleDocuMed: {
          ORDERID: '110000000202',
          POS_ID: '',
          MEASUREMENT_POINT: '250',
          SECONDARY_INDEX: '',
          READING_DATE: '20150531',
          READING_TIME: '090000',
          SHORT_TEXT: 'TEST FROM SOAP BHL',
          READER: '',
          ORIGIN_INDICATOR: '',
          READING_AFTER_ACTION: '',
          RECORDED_VALUE: '10',
          RECORDED_UNIT: 'H',
          DIFFERENCE_READING: '',
          CODE_CATALOGUE: '',
          CODE_GROUP: '',
          VALUATION_CODE: '',
          CODE_VERSION: '',
          USER_DATA: '',
          CHECK_CUSTOM_DUPREC: '',
          WITH_DIALOG_SCREEN: '',
          PREPARE_UPDATE: '',
          COMMIT_WORK: 'X',
          WAIT_AFTER_COMMIT: 'X',
          CREATE_NOTIFICATION: '',
          NOTIFICATION_TYPE: '',
          NOTIFICATION_PRIO: ''
        }
      }, function(err, result) {
        console.log(err);
        console.log(result);
        if (err) {
          reply({
            err:err
          });
        } else {
          reply(result);
        }
      });
    });
  }
});

// Add the route
server.route({
  method: 'GET',
  path: '/consPtosMed/{equipo}',
  handler: function(request, reply) {
    var soap = require('soap');
    var url = 'os_ConsPtosMed.wsdl';
    soap.createClient(url, function(err, client) {
      client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
      client.os_ConsPtosMed({
        Equipos: {
          Equipo: request.params.equipo
        }
      }, function(err, result) {
        console.log(err);
        console.log(result);
        if (err) {
          reply({
            err:err
          });
        } else {
          reply(result);
        }
      });
    });
  }
});

server.route({
  method: 'GET',
  path: '/consCodVal',
  handler: function(request, reply) {
    var soap = require('soap');
    var url = 'os_ConsCodVal.wsdl';
    soap.createClient(url, function(err, client) {
      client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
      client.os_ConsCodVal({
        CodGrupos: {
          CodGrupo: 'ZGC00002'
        }
      }, function(err, result) {
        console.log(err);
        console.log(result);
        if (err) {
          reply({
            err:err
          });
        } else {
          reply(result);
        }
      });
    });
  }
});

server.route({
  method: 'POST',
  path: '/crearOrden',
  handler: function(request, reply) {
    var soap = require('soap');
    var url = 'os_RespCrearOrdenMantResp.wsdl';
    soap.createClient(url, function(err, client) {
      client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));

      var xml = {
        CONF_NO: 0,
        ORDERID: '110000000202',
        OPERATION: '0010',
        SUB_OPER: '',
        COMPLETE: '',
        DEV_REASON: '',
        CONF_TEXT: 'New Notif SOAP BHL XXX',
        PLANT: '',
        WORK_CNTR: 'SUP_MTO',
        ACT_WORK:'1',
        UN_WORK: 'H',
        UN_WORK_ISO: '',
        EXEC_START_DATE: '2015-05-29',
        EXEC_START_TIME: '13:00:00',
        EXEC_FIN_DATE: '2015-05-29',
        EXEC_FIN_TIME: '15:00:00',
        ACT_TYPE: '',
        CALC_MOTIVE: '',
        ACT_WORK_2:''
      };

      client.os_RespCrearOrdenMantResp({
        TIMETICKETS: {item: xml}
      }, function(err, result) {
        console.log(err);
        console.log(result);
        if (err) {
          reply({
            err:err
          });
        } else {
          reply(result);
        }
      });
    });
  }
});

server.route({
  method: 'GET',
  path:'/ordenes',
  handler: function(request, reply) {
    console.log('Cargando Ordenes...');
    console.time('Cargando Ordenes...');
    var soap = require('soap');
    var url = 'os_OrderGetDetailResp.wsdl';
    soap.createClient(url, function(err, client) {
      client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
      client.os_OrderGetDetailResp({
        PLANT: '6000',
        PLANGROUP: 'E10',
        START_DATE: '2015-01-04'
      }, function(err, result) {
        var ordenes = [],
            operaciones = [];

        if (err) {
          reply({
            err:err
          });
        }
        _.each(result.ET_OPERATIONS.item, function(op) {
          operaciones.push({
            orderId: op.ORDERID.trim(),
            actividad: op.ACTIVITY,
            title: op.DESCRIPTION,
            duration: 60,
            status: 0
          });
        });
        _.each(result.ET_HEADER.item, function(opTx) {
          ordenes.push({
            id: opTx.ORDERID,
            descripcionCabecera: opTx.DESC_TEXT,
            grupoPlanificador: opTx.DESC_PLANT,
            equipo: opTx.EQUIPMENT,
            details: [
              {
                label: 'Descripcion del Equipo',
                value: opTx.DESC_EQUIP
              },
              {
                label: 'Identificacion Tecnica',
                value: opTx.ID_TECNICA
              },
              {
                label: 'Equipo Superior',
                value: opTx.SUPEREQUI
              },
              {
                label: 'Denominador Equipo Superior',
                value: opTx.DESC_SUPEQU
              },
              {
                label: 'Interlocutor Responsable',
                value: opTx.INT_RESPON
              },
              {
                label: 'Interlocutor Solicitante',
                value: opTx.INT_SOLICIT
              },
              {
                label: 'Centro de emplazamiento',
                value: opTx.DESC_MAINTPLANT
              },
              {
                label: 'Area de la Empresa',
                value: opTx.DESC_PLSECTN
              },
              {
                label: 'UT',
                value: opTx.DESC_FUNCT_LOC
              },
              {
                label: 'Clase de Actividad PM',
                value: opTx.DESC_PMACTTYPE
              },
              {
                label: 'Proximo Mantenimiento',
                value: opTx.FEC_PROX_MANT
              }
            ],
            mediciones : [],
            operations: _.filter(operaciones, {orderId: opTx.ORDERID.trim()})
          });
        });

        var i = 0;
        async.each(ordenes, function(item, callback) {
          recopeFunciones.buscarMedicion(item.equipo.trim()).then(function(mediciones) {
            i++;
            item.mediciones = mediciones;
            console.log(i);
            callback();
          }, function(err) {
            //console.log(JSON.stringify(err.root));
            console.log('error buscando Equipo con '+ item.equipo.trim());
            callback();
          });
        }, function(err) {
          //console.log(err);
          console.timeEnd('Cargando Ordenes...');
          reply(ordenes);
        });
      });
    });
  }
});
console.log('Levantando node...');
// Start the server
server.start();
