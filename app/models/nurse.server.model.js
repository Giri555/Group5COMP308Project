// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Define a new 'NurseSchema'
var NurseSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        // Validate the email format (must include '@nurse.ca')
        match: [
            /[a-zA-Z0-9]+@nurse\.ca/i,
            '(Nurse) Please provide a valid email address - email format must include @nurse.ca',
        ],
    },
    password: {
        type: String,
        // Validate the 'password' value length
        validate: [
            (password) => password && password.length > 6,
            'Password should be longer than 6 characters',
        ],
    },
    patientList: [
        {
            type: Schema.ObjectId,
            ref: 'Patient',
        },
    ],
});

// Set the 'fullname' virtual property
NurseSchema.virtual('fullName')
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
NurseSchema.pre('save', function (next) {
    //hash the password before saving it
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

// Create an instance method for authenticating student
NurseSchema.methods.authenticate = function (password) {
    //compare the hashed password of the database
    //with the hashed version of the password the user enters
    return this.password === bcrypt.hashSync(password, saltRounds);
};

// Configure the 'NurseSchema' to use getters and virtuals when transforming to JSON
NurseSchema.set('toJSON', {
    getters: true,
    virtuals: true,
});

// Create the 'Nurse' model out of the 'NurseSchema'
mongoose.model('Nurse', NurseSchema);
