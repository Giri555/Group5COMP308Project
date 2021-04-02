// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'EmergencyAlertSchema'
var EmergencyAlertSchema = new Schema({
    dateTime: {
        type: Date,
        default: Date.now,
    },
    title: String,
    emergencyContacts: String,
    creator: {
        type: Schema.ObjectId,
        ref: 'Patient',
    },
});

// Create the 'EmergencyAlert' model out of the 'EmergencyAlertSchema'
mongoose.model('EmergencyAlert', EmergencyAlertSchema);
