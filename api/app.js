var Hapi = require('hapi'),
    _ = require('lodash');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 8880
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
        var ordenes = [];

        if (err) {
          reply({
            err:err
          });
        }
        _.each(result.ET_HEADER.item, function(opTx) {
          ordenes.push({
            descipcionEquipo: opTx.DESC_EQUIP,
            idTecnica: opTx.ID_TECNICA,
            equipoSuperior: opTx.SUPEREQUI,
            denominacionEquipoSuperior: opTx.DESC_SUPEQU,
            descripcionCabecera: opTx.DESC_TEXT,
            interlocutorResponsable: opTx.INT_RESPON,
            interlocutorSolicitane: opTx.INT_SOLICIT,
            grupoPlanificador: opTx.DESC_PLANT,
            centroEmplazamiento: opTx.DESC_MAINTPLANT,
            emplazamiento: opTx.DESC_LOCATION,
            areaDeEmpresa: opTx.DESC_PLSECTN,
            UT: opTx.DESC_FUNCT_LOC,
            claseActividadPM: opTx.DESC_PMACTTYPE,
            proximoMantenimiendoDate: opTx.FEC_PROX_MANT
          });
        });
        console.log(ordenes);
        console.timeEnd('Cargando Ordenes...');
        reply(ordenes);


      });
    });
  }
});
console.log('Levantando node...');
// Start the server
server.start();

/*
*
* { ORDERID: '110000000259',
 ORDER_TYPE: 'PM01',
 PLANPLANT: '6000',
 BUS_AREA: {},
 MN_WK_CTR: 'SUP_MTO',
 PLANT: '6000',
 MN_WKCTR_ID: '10000024',
 PMACTTYPE: '003',
 PLANGROUP: 'E10',
 SYSTCOND: {},
 FUNCT_LOC: 'REC-PEA-SAP-EAGEN002',
 EQUIPMENT: 'PI-5707',
 SERIALNO: {},
 MATERIAL: {},
 ASSEMBLY: {},
 DEVICEDATA: {},
 MAINTPLANT: '6000',
 LOCATION: 'GDV007',
 MAINTROOM: 'PRODNEGR',
 PLSECTN: 'PN',
 LOC_WK_CTR: {},
 LOC_WKCTR_ID: '10000005',
 ABCINDIC: {},
 SORTFIELD: 'ENTRADA VAPOR TQ 118',
 COMP_CODE: '1000',
 PROFIT_CTR: {},
 CO_AREA: '1000',
 RESPCCTR: {},
 FUNC_AREA: {},
 SUPERIOR_NETWORK: {},
 SUPERIOR_ACTIVITY: {},
 SUPERIOR_ROUTING_NO: '0000000000',
 SUPERIOR_COUNTER: '00000000',
 WBS_ELEM: '00000000',
 PROJ_DEF: '00000000',
 PROCESSING_GROUP: '00',
 OBJECTCLASS: 'OC',
 TAXJURCODE: {},
 LOC_COMP_CODE: '1000',
 LOC_CO_AREA: '1000',
 ASSET_NO: {},
 SUB_NUMBER: {},
 LOC_BUS_AREA: {},
 COSTCENTER: '0000342504',
 LOC_WBS_ELEM: '00000000',
 STANDORDER: {},
 SETTLORDER: {},
 SALESORG: {},
 DISTR_CHAN: {},
 DIVISION: {},
 ORDPLANID: {},
 START_DATE: Sun May 31 2015 18:00:00 GMT-0600 (CST),
 FINISH_DATE: Sun May 31 2015 18:00:00 GMT-0600 (CST),
 BASICSTART: '00:00:00',
 BASIC_FIN: '24:00:00',
 PRIORITY: '4',
 REVISION: {},
 VERSION: '00',
 SCHED_TYPE: '1',
 AUTOSCHED: 'X',
 CAP_REQMTS: 'X',
 SCHEDULING_EXACT_BREAK_TIMES: {},
 MRP_RELEVANT: '2',
 PRODUCTION_START_DATE: Sun May 31 2015 18:00:00 GMT-0600 (CST),
 PRODUCTION_FINISH_DATE: Sun May 31 2015 18:00:00 GMT-0600 (CST),
 PRODUCTION_START_TIME: '00:00:00',
 PRODUCTION_FINISH_TIME: '00:00:00',
 ACTUAL_START_DATE: Invalid Date,
 ACTUAL_FINISH_DATE: Invalid Date,
 ACTUAL_START_TIME: '00:00:00',
 ACTUAL_FINISH_TIME: '00:00:00',
 REFDATE: Wed May 27 2015 18:00:00 GMT-0600 (CST),
 SALES_ORD: {},
 S_ORD_ITEM: '000000',
 CALC_MOTIVE: {},
 INVEST_PROFILE: {},
 SCALE: {},
 INV_REASON: {},
 ENVIR_INVEST: {},
 ESTIMATED_COSTS: '0',
 CURRENCY: 'CRC',
 CURRENCY_ISO: 'CRC',
 CSTG_SHEET: 'PP-PC1',
 OVERHEAD_KEY: {},
 RES_ANAL_KEY: {},
 NETWORK_PROFILE: 'PM01',
 CSTGVAPPLN: 'PM01',
 CSTGVARACT: 'PM01',
 TASK_LIST_GROUP: {},
 GROUP_COUNTER: {},
 TASK_LIST_TYPE: 'E',
 RESP_PLANNER_GROUP: {},
 MNTPLAN: {},
 MAINTITEM: {},
 CALL_NO: 0,
 LAST_ORD: {},
 ENTERED_BY: 'MIGUEL-FA',
 ENTER_DATE: Wed May 27 2015 18:00:00 GMT-0600 (CST),
 CHANGED_BY: 'MARCO-CG',
 CHANGE_DATE: Wed May 27 2015 18:00:00 GMT-0600 (CST),
 SCENARIO: 'O100',
 SYS_STATUS: 'CERR NEJE PREC',
 USER_ST: 'X',
 USERSTATUS: 'CREA',
 STAT_PROF: 'ZPM01',
 OBJECT_NO: 'OR110000000259',
 ROUTING_NO: '1000009325',
 RESERV_NO: '0000033630',
 SHORT_TEXT: 'PRUEBA DE MATERIALES 28-05-2015',
 LONG_TEXT: {},
 NOTIF_NO: {},
 ASSEMBLY_EXTERNAL: {},
 ASSEMBLY_GUID: {},
 ASSEMBLY_VERSION: {},
 MATERIAL_EXTERNAL: {},
 MATERIAL_GUID: {},
 MATERIAL_VERSION: {},
 DESC_TEXT: {},
 INT_RESPON: {},
 INT_SOLICIT: {},
 DESC_PLANT: 'U.INSTRUMENTACIÓN',
 DESC_MAINTPLANT: 'PRODUCTO NEGRO',
 DESC_LOCATION: {},
 DESC_PLSECTN: 'PRODUCTO NEGRO',
 DESC_FUNCT_LOC: 'SERVICIO GENERAL PRODUCTO NEGRO',
 SUPEREQUI: {},
 DESC_SUPEQU: {},
 DESC_EQUIP: 'INDICADOR DE PRESIÓN  (MANÓMETRO)',
 ID_TECNICA: '0 A 16 BAR',
 DESC_PMACTTYPE: 'Reparación',
 FEC_PROX_MANT: '0000-00-00' }
 */