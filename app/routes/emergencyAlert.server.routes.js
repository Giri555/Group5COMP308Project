const EmergencyAlertsController = require('../controllers/emergencyAlert.server.controller');
const PatientController = require('../controllers/patient.server.controller');

module.exports = function (app) {
        app.param('emergencyAlertId', EmergencyAlertsController.emergencyAlertByID);

        app.route('/api/patient/emergencyAlerts')
        .post(PatientController.requiresLogin, EmergencyAlertsController.create);

        app.route('/api/nurse/emergencyAlerts')
        .get(EmergencyAlertsController.list);
       

        app.route('/api/nurse/:emergencyAlertId')
        .get(EmergencyAlertsController.read)
        .put(EmergencyAlertsController.update)
        .delete(EmergencyAlertsController.delete);
};
