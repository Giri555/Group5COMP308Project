const MotivationalTipsController = require('../controllers/motivationalTip.server.controller');
const NurseController = require('../controllers/nurse.server.controller');


module.exports = function (app) {
 
        app.param('motivationalTipId', MotivationalTipsController.motivationalTipById);

        app
        .route("/api/motivationalTips")
        .get(MotivationalTipsController.list)
        .post(NurseController.requiresLogin, MotivationalTipsController.hasAuthorization, MotivationalTipsController.createVitalSign);

        app
        .route("/api/motivationalTips/:motivationalTipId")
        .get(MotivationalTipsController.read)
        .put(MotivationalTipsController.update);

        app.route("/api/motivationalTips/:motivationalTipId/:patientId")
        .put(MotivationalTipsController.sendTip)


};
