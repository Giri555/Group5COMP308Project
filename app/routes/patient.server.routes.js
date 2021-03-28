// Load the 'patient' controller
const PatientController = require('../../app/controllers/patient.server.controller');

// Define the routes module' method
module.exports = function (app) {
    // handle a post request made to root path
    app.post('/api/patient/sign-up', PatientController.create);

    // Set up the 'patients' parameterized routes
    app.route('api/patients/:patientId')
        .get(PatientController.read)
        .put(PatientController.update)
        .delete(PatientController.delete);
    // Set up the 'patientId' parameter middleware
    // All param callbacks will be called before any handler of
    // any route in which the param occurs, and they will each
    // be called only once in a request - response cycle,
    // even if the parameter is matched in multiple routes
    app.param('patientId', PatientController.patientByID);
    // authenticate patient
    app.post('/api/patient/sign-in', PatientController.authenticate);
    app.get('/api/patient/sign-out', PatientController.signout);
    app.get('/api/patient/read-cookie', PatientController.isSignedIn);

    // path to a protected page
    app.get('api/patient/welcome', PatientController.welcome);
};
