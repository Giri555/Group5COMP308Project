const MedicalConditionsController = require('../controllers/medicalConditions.server.controller');

module.exports = function (app) {
    // app.get('/get-data', MedicalConditionsController.getData); // only done once
    app.post('/predict', MedicalConditionsController.predictPrognosis);
};
