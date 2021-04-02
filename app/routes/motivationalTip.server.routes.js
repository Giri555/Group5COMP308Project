const MotivationalTipsController = require("../controllers/motivationalTip.server.controller");
const NurseController = require("../controllers/nurse.server.controller");

module.exports = function (app) {
  app.param(
    "motivationalTipId",
    MotivationalTipsController.motivationalTipById
  );

  //get tips by nurse ID
  //create motivational tip and specify the creator as a current user
  app
    .route("/api/nurse/motivationalTips")
    .get(
      NurseController.requiresLogin,
      MotivationalTipsController.listTipsByNurseId
    )
    .post(NurseController.requiresLogin, MotivationalTipsController.create);

   app
  .route('/api/motivationalTips/:motivationalTipId')
  .get(MotivationalTipsController.read);
  // .put(MotivationalTipsController.update);

  //send tip to a patient
  app
    .route('/api/nurse/motivationalTips/:motivationalTipId/:patientId')
    .put(
      NurseController.requiresLogin,
      MotivationalTipsController.sendTip
    );
};
