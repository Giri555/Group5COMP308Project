// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'VitalSignSchema'
var VitalSignSchema = new Schema({
    dateTime: {
        type: Date,
        default: Date.now,
    },
    bodyTemperature: String,
    heartRate: String,
    bloodPressure: String,
    respiratoryRate: String,
    pulseRate: String,
    weight: String,
    patient: {
        type: Schema.ObjectId,
        ref: 'Patient',
    },
});

// Create the 'VitalSign' model out of the 'VitalSignSchema'
mongoose.model('VitalSign', VitalSignSchema);
