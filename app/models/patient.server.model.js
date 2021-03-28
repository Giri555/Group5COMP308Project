// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Define a new 'PatientSchema'
var PatientSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        // Validate the email format
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        // Validate the 'password' value length
        validate: [
            (password) => password && password.length > 6,
            'Password should be longer than 6 characters',
        ],
    },
    requirements: {
        bodyTemperature: Boolean,
        heartRate: Boolean,
        bloodPressure: Boolean,
        respiratoryRate: Boolean,
        pulseRate: Boolean,
        weight: Boolean,
    },
    motiTipList: [{
        type: Schema.ObjectId,
        ref: 'MotivationalTip',
    }]
});

// Set the 'fullname' virtual property
PatientSchema.virtual('fullName')
    .get(function () {
        return this.firstName + ' ' + this.lastName;
    })
    .set(function (fullName) {
        const splitName = fullName.split(' ');
        this.firstName = splitName[0] || '';
        this.lastName = splitName[1] || '';
    });

// Use a pre-save middleware to hash the password
// before saving it into database
PatientSchema.pre('save', function (next) {
    //hash the password before saving it
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

// Create an instance method for authenticating student
PatientSchema.methods.authenticate = function (password) {
    //compare the hashed password of the database
    //with the hashed version of the password the user enters
    return this.password === bcrypt.hashSync(password, saltRounds);
};

// Configure the 'PatientSchema' to use getters and virtuals when transforming to JSON
PatientSchema.set('toJSON', {
    getters: true,
    virtuals: true,
});

// Create the 'Patient' model out of the 'PatientSchema'
mongoose.model('Patient', PatientSchema);
