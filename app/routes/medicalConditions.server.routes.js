const MedicalConditionsController = require('../controllers/medicalConditions.server.sontroller');

module.exports = function (app) {

/*
    app.get('/', function (req, res) {
        res.render('index', {
            info: 'see the results in console window',
        });
    });
*/

    app.get('/run', MedicalConditionsController.trainAndPredict);

//     app.post('/run', MedicalConditionsController.trainAndPredict);
};

