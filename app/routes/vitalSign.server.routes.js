const VitalSignsController = require('../controllers/vitalSign.server.controller');
const NurseController = require('../controllers/nurse.server.controller');
const PatientController = require('../controllers/patient.server.controller');

module.exports = function (app) {
    // NOTE: need to add authentication

    // set up 'vitalSignsId' parameter middleware
    app.param('vitalSignsId', VitalSignsController.vitalSignsById);

    // ######  Nurse's requirements: (Vital Signs)  ######

    // NR1) nurse needs to update a specific patient document, with their required vital signs
    app.route('/api/vital-signs/update-patient-requirements/:patientId').put(
        VitalSignsController.updatePatientsRequirements
    );

    // NR2) nurse needs to create a vital signs document for a specific patient
    app.route('/api/vital-signs/nurse/:patientId').post(
        VitalSignsController.create
    );

    // NR3) nurse needs to read a specific vital signs document for a specific patient
    // NR4) nurse needs to update a specific vital signs document for a specific patient
    // NR5) nurse needs to delete a specific vital signs document for a specific patient
    app.route('/api/vital-signs/nurse/:patientId/:vitalSignsId')
        .get(VitalSignsController.read)
        .put(VitalSignsController.update)
        .delete(VitalSignsController.delete);

    // NR6) nurse needs to list all the vital signs documents they made for a specific patient
    app.route('/api/vital-signs/nurse/:patientId').get(
        VitalSignsController.list
    );

    // ######  Patient's requirements: (Daily Information)  ######

    // PR1) patient needs to create a daily information document, for the vital signs required by the nurse
    app.route('/api/daily-info/patient/:patientId').post(
        VitalSignsController.createDailyInfo
    );

    // PR2) patient needs to read a daily information document
    // PR3) patient needs to update a daily information document (in case they made an error)
    // PR4) patient needs to delete a daily information document
    app.route('/api/daily-info/patient/:patientId/:vitalSignsId')
        .get(VitalSignsController.readDailyInfo)
        .put(VitalSignsController.updateDailyInfo)
        .delete(VitalSignsController.deleteDailyInfo);

    // PR5) patient needs to list all the daily information documents that they have created
    app.route('/api/daily-info/patient/:patientId').get(
        VitalSignsController.listDailyInfo
    );
};
