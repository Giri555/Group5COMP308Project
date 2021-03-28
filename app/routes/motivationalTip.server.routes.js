var motivationalTips = require('../controllers/motivationalTip.server.controller');
var nurses = require('../controllers/nurse.server.controller');


module.exports = function (app) {
 
        app.param('motivationalTipId', motivationalTips.motivationalTipById);

        app
        .route("/api/motivationalTips")
        .get(motivationalTips.list)
        .post(nurses.requiresLogin, motivationalTips.hasAuthorization, motivationalTips.createVitalSign);

        app
        .route("/api/motivationalTips/:motivationalTipId")
        .get(motivationalTips.read)
        .put(motivationalTips.update);

        app.route("/api/motivationalTips/:motivationalTipId/:patientId")
        .put(motivationalTips.sendTip)


};
