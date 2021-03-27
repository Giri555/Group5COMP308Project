// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'MotivationalTipSchema'
var MotivationalTipSchema = new Schema({
    title: String,
    content: String,
    patient: {
        type: Schema.ObjectId,
        ref: 'Patient',
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'Nurse',
    },
});

// Create the 'MotivationalTip' model out of the 'MotivationalTipSchema'
mongoose.model('MotivationalTip', MotivationalTipSchema);
