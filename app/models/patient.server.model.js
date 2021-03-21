// Load the Mongoose module and Schema object
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'PatientSchema'
var PatientSchema = new Schema({



});

// Create the 'Patient' model out of the 'PatientSchema'
mongoose.model('Patient', PatientSchema);
