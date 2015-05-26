angular
  .module('recope.order')
  .filter('byStatus', operationFilter);

function operationFilter() {
  return function (operations) {
    var unfinished = []
      , finished   = [];

    if (!operations) {
      return;
    }

    operations.forEach(function (operation) {

      if (operation.status === 3) {
        finished.push(operation);
      }
      else {
        unfinished.push(operation);
      }
    });

    return unfinished.concat(finished);
  }
}
