// Load the module dependencies
const Patient = require('mongoose').model('Patient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

// Create a new error handling controller method
const getErrorMessage = function (err) {
    // Define the error message variable
    var message = '';

    // If an internal MongoDB error occurs get the error message
    if (err.code) {
        switch (err.code) {
            // If a unique index error occurs set the message error
            case 11000:
            case 11001:
                message = 'Email already exists';
                break;
            // If a general error occurs set the message error
            default:
                message = 'Something went wrong';
        }
    } else {
        // Grab the first error message from a list of possible errors
        for (const errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    // Return the message error
    return message;
};
// Create a new patient
exports.create = function (req, res, next) {
    // Create a new instance of the 'Patient' Mongoose model
    var patient = new Patient(req.body); //get data from React form
    console.log('body: ' + req.body.email);

    // Use the 'Patient' instance's 'save' method to save a new patient document
    patient.save(function (err) {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.json(patient);
        }
    });
};
//
// Returns all patients
exports.list = function (req, res, next) {
    // Use the 'Patient' instance's 'find' method to retrieve a new patient document
    Patient.find({}, function (err, patients) {
        if (err) {
            return next(err);
        } else {
            res.json(patients);
        }
    });
};
//
//'read' controller method to display a patient
exports.read = function (req, res) {
    // Use the 'response' object to send a JSON response
    res.json(req.patient);
};
//
// 'patientByID' controller method to find a patient by its id
exports.patientByID = function (req, res, next, id) {
    // Use the 'Patient' static 'findOne' method to retrieve a specific patient
    Patient.findOne(
        {
            _id: id,
        },
        (err, patient) => {
            if (err) {
                // Call the next middleware with an error message
                return next(err);
            } else {
                // Set the 'req.patient' property
                req.patient = patient;
                console.log(patient);
                // Call the next middleware
                next();
            }
        }
    );
};
//update a patient by id
exports.update = function (req, res, next) {
    console.log(req.body);
    Patient.findByIdAndUpdate(
        req.patient.id,
        req.body,
        function (err, patient) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.json(patient);
        }
    );
};
// delete a patient by id
exports.delete = function (req, res, next) {
    Patient.findByIdAndRemove(
        req.patient.id,
        req.body,
        function (err, patient) {
            if (err) return next(err);
            res.json(patient);
        }
    );
};
//
// authenticates a patient
exports.authenticate = function (req, res, next) {
    // Get credentials from request
    console.log(req.body);

    const email = req.body.auth.email;
    const password = req.body.auth.password;

    // test api
    // const email = req.body.email;
    // const password = req.body.password;

    console.log(password);
    console.log(email);
    //find the patient with given email using static method findOne
    Patient.findOne({ email: email }, (err, patient) => {
        if (err) {
            return next(err);
        } else {
            if (!patient) {
                console.log(`!!! patient email invalid !!!`);
                res.json({
                    status: 'error',
                    message: 'Invalid Patient Email',
                    data: null,
                });
                return next();
            }
            console.log(patient);
            //compare passwords
            if (bcrypt.compareSync(password, patient.password)) {
                // Create a new token with the patient id in the payload
                // and which expires 300 seconds after issue
                const patientToken = jwt.sign(
                    { id: patient._id, email: patient.email },
                    jwtKey,
                    { algorithm: 'HS256', expiresIn: jwtExpirySeconds }
                );
                console.log('patientToken:', patientToken);
                // set the cookie as the token string, with a similar max age as the token
                // here, the max age is in milliseconds
                res.cookie('patientToken', patientToken, {
                    maxAge: jwtExpirySeconds * 1000,
                    httpOnly: true,
                });
                // res.status(200).send({ screen: patient.email });

                req.patient = patient;

                res.json({
                    status: 'success',
                    message: 'patient found!!!',
                    data: {
                        patient: patient,
                        patientToken: patientToken,
                    },
                });
                //call the next middleware
                next();
            } else {
                res.json({
                    status: 'error',
                    message: 'Invalid Password',
                    data: null,
                });
            }
        }
    });
};
//
// protected page uses the JWT token
exports.welcome = (req, res) => {
    // We can obtain the session token from the requests cookies,
    // which come with every request
    const patientToken = req.cookies.patientToken;
    console.log(patientToken);
    // if the cookie is not set, return an unauthorized error
    if (!patientToken) {
        return res.status(401).end();
    }

    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(patientToken, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end();
        }
        // otherwise, return a bad request error
        return res.status(400).end();
    }

    // Finally, return the welcome message to the patient, along with their
    // email given in the token
    // use back-quotes here
    res.send(`${payload.email}`);
};
//
//sign out function in controller
//deletes the token on the client side by clearing the cookie named 'token'
exports.signout = (req, res) => {
    res.clearCookie('patientToken');
    return res.status('200').json({ message: 'Patient signed out' });
    // Redirect the patient back to the main application page
    //res.redirect('/');
};
//check if the patient is signed in
exports.isSignedIn = (req, res) => {
    // Obtain the session token from the requests cookies,
    // which come with every request
    const patientToken = req.cookies.patientToken;
    console.log(patientToken);
    // if the cookie is not set, return 'auth'
    if (!patientToken) {
        return res.send({ screen: 'auth' }).end();
    }
    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(patientToken, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // the JWT is unauthorized, return a 401 error
            return res.status(401).end();
        }
        // otherwise, return a bad request error
        return res.status(400).end();
    }

    // Finally, token is ok, return the email given in the token
    res.status(200).send({ screen: payload.email });
};

//isAuthenticated() method to check whether a patient is currently authenticated
exports.requiresLogin = function (req, res, next) {
    // Obtain the session token from the requests cookies,
    // which come with every request
    const patientToken = req.cookies.patientToken;
    console.log(patientToken);
    // if the cookie is not set, return an unauthorized error
    if (!patientToken) {
        return res.send({ screen: 'auth' }).end();
    }
    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(patientToken, jwtKey);
        console.log('in requiresLogin - payload:', payload);
        req.id = payload.id;
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end();
        }
        // otherwise, return a bad request error
        return res.status(400).end();
    }
    // patient is authenticated
    //call next function in line
    next();
};
