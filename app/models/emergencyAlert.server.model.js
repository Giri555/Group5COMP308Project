// Load the Mongoose module and Schema object
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'EmergencyAlertSchema'
var EmergencyAlertSchema = new Schema({



});

// Create the 'EmergencyAlert' model out of the 'EmergencyAlertSchema'
mongoose.model('EmergencyAlert', EmergencyAlertSchema);
