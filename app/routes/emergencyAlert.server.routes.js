const EmergencyAlertsController = require('../controllers/emergencyAlert.server.controller');
const PatientController = require('../controllers/patient.server.controller');

module.exports = function (app) {
        app.param('emergencyAlertId', EmergencyAlertsController.emergencyAlertByID);

        app.route("/api/emergencyAlerts")
        .get(EmergencyAlertsController.list)
        .post(PatientController.requiresLogin, EmergencyAlertsController.hasAuthorization, EmergencyAlertsController.create);

        app.route("/api/emergencyAlerts/:emergencyAlertId")
        .get(EmergencyAlertsController.read)
        .put(EmergencyAlertsController.update);
};
