var Hapi = require('hapi'),
    _ = require('lodash');

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
  path:'/ordenes',
  handler: function (request, reply) {
    console.log('Cargando Ordenes...');
    console.time('Cargando Ordenes...');
    var soap = require('soap');
    var url = 'os_OrderGetDetailResp.wsdl';
    soap.createClient(url, function(err, client) {
      client.setSecurity(new soap.BasicAuthSecurity('USRCP_HW', 'usrcp2012'));
      client.os_OrderGetDetailResp({
        PLANT: '6000',
        PLANGROUP: 'E10',
        START_DATE: '2014-11-26'
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
            mediciones : [{
              label: "Presión de la máquina",
              value: "5 mb/s"
            }, {
              label: "Medidor de agua",
              value: "7 tons"
            }, {
              label: "Cilindros por metro cúbico",
              value: "7"
            }, {
              label: "Calibración de presión",
              value: "45 grados"
            }],
            operations : [{
              title    : "Operación 4859301",
              duration : "3600",
              status   : "0"
            }, {
              title    : "Operación 84913839",
              duration : "60",
              status   : "0"
            }],
            operations: _.filter(operaciones, {orderId: opTx.ORDERID.trim()})
          });
        });
        console.timeEnd('Cargando Ordenes...');
        reply(ordenes);

      });
    });
  }
});
console.log('Levantando node...');
// Start the server
server.start();