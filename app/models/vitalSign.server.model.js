// Load the Mongoose module and Schema object
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'VitalSignSchema'
var VitalSignSchema = new Schema({



});

// Create the 'VitalSign' model out of the 'VitalSignSchema'
mongoose.model('VitalSign', VitalSignSchema);
