// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'EmergencyAlertSchema'
var EmergencyAlertSchema = new Schema({
    title: String,
    dateTime: {
        type: Date,
        default: Date.now,
    },
    emergencyContacts: String,
    creator: {
        type: Schema.ObjectId,
        ref: 'Patient',
    },
    sendTo: {
        type: Schema.ObjectId,
        ref: 'Nurse',
    },
});

// Create the 'EmergencyAlert' model out of the 'EmergencyAlertSchema'
mongoose.model('EmergencyAlert', EmergencyAlertSchema);
