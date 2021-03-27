// Load the 'patient' controller
var patients = require('../../app/controllers/patient.server.controller');
var express = require('express');
var router = express.Router();

// Define the routes module' method
module.exports = function (app) {
    //handle a post request made to root path
    app.post('/', patients.create);
    //
    // Set up the 'patients' parameterized routes 
	app.route('/patients/:patientId')
    .get(patients.read)
    .put(patients.update)
    .delete(patients.delete)
    // Set up the 'userId' parameter middleware
    //All param callbacks will be called before any handler of 
    //any route in which the param occurs, and they will each 
    //be called only once in a request - response cycle, 
    //even if the parameter is matched in multiple routes
    app.param('patientId', patients.patientByID);
    //authenticate user
    app.post('/signin', patients.authenticate);
    app.get('/signout', patients.signout);
    app.get('/read_cookie', patients.isSignedIn);


    //path to a protected page
	app.get('/welcome',patients.welcome);
    
};
