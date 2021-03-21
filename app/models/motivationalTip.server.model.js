// Load the Mongoose module and Schema object
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'MotivationalTipSchema'
var MotivationalTipSchema = new Schema({



});

// Create the 'MotivationalTip' model out of the 'MotivationalTipSchema'
mongoose.model('MotivationalTip', MotivationalTipSchema);
