// Load the Mongoose module and Schema object
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'NurseSchema'
var NurseSchema = new Schema({



});

// Create the 'Nurse' model out of the 'NurseSchema'
mongoose.model('Nurse', NurseSchema);
