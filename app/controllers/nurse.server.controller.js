// Load the module dependencies
const Nurse = require('mongoose').model('Nurse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

exports.nurseByID = function (req, res, next, id) {
    Nurse.findOne({_id: id,},(err, nurse) => {
            if (err) {
                // Call the next middleware with an error message
                return next(err);
            } else {
                // Set the 'req.nurse' property
                req.nurse = nurse;
                console.log(nurse);
                // Call the next middleware
                next();
            }
        }
    );
};

exports.authenticate = function (req, res, next) {
    // Get credentials from request
    console.log(req.body);
    const email = req.body.auth.email;
    const password = req.body.auth.password;

    // test api
    // const email = req.body.email;
    // const password = req.body.password;

    console.log(email);
    console.log(password);

    Nurse.findOne({ email: email }, (err, nurse) => {
        if (err) {
            return next(err);
        } else {
            // findOne returns null if no results:
            if (!nurse) {
                console.log(`!!! nurse email invalid !!!`);
                res.json({
                    status: 'error',
                    message: 'Invalid nurse email',
                    data: null,
                });
                return next();
            }

            console.log(nurse);
            // compare passwords
            if (bcrypt.compareSync(password, nurse.password)) {
                // Create a new token with the nurse id in the payload
                // and which expires 300 seconds after issue
                const nurseToken = jwt.sign(
                    { id: nurse._id, email: nurse.email },
                    jwtKey,
                    { algorithm: 'HS256', expiresIn: jwtExpirySeconds }
                );
                console.log('nurseToken:', nurseToken);
                // set the cookie as the token string, with a similar max age as the token
                // here, the max age is in milliseconds
                res.cookie('nurseToken', nurseToken, {
                    maxAge: jwtExpirySeconds * 1000,
                    httpOnly: true,
                });
                // res.status(200).send({
                //     screen: nurse.email,
                //     nurseToken: nurseToken,
                // });

                res.json({
                    status: 'success',
                    message: 'nurse found !!!',
                    data: {
                        nurse: nurse,
                        nurseToken: nurseToken,
                    },
                });

                req.nurse = nurse;
                //call the next middleware
                next();
            } else {
                console.log('!!! Password incorrect !!!');
                res.json({
                    status: 'error',
                    message: 'Invalid Password',
                    data: null,
                });
            }
        }
    });
};

// sign out function in controller
// deletes the token on the client side by clearing the cookie named 'token'
exports.signout = (req, res) => {
    res.clearCookie('nurseToken');
    return res.status('200').json({ message: 'Nurse signed out' });
    // Redirect the nurse back to the main application page
    //res.redirect('/');
};

// check if the nurse is signed in
exports.isSignedIn = (req, res) => {
    // Obtain the session token from the requests cookies,
    // which come with every request
    const nurseToken = req.cookies.nurseToken;
    console.log(nurseToken);
    // if the cookie is not set, return 'auth'
    if (!nurseToken) {
        return res.send({ screen: 'auth' }).end();
    }
    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(nurseToken, jwtKey);
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

// isAuthenticated() method to check whether a nurse is currently authenticated
exports.requiresLogin = function (req, res, next) {
    // Obtain the session token from the requests cookies,
    // which come with every request
    const nurseToken = req.cookies.nurseToken;
    console.log(nurseToken);
    // if the cookie is not set, return an unauthorized error
    if (!nurseToken) {
        return res.send({ screen: 'auth' }).end();
    }
    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(nurseToken, jwtKey);
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
    // nurse is authenticated
    // call next function in line
    next();
};

// Create a new nurse (nurse signup)
exports.create = function (req, res, next) {
    var nurse = new Nurse(req.body); // get data from React form
    console.log('body: ' + req.body.email);

    nurse.save(function (err) {
        if (err) {
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.json(nurse);
        }
    });
};

exports.list = function (req, res, next) {
    Nurse.find({}, function (err, nurses) {
        if (err) {
            return next(err);
        } else {
            res.json(nurses);
        }
    });
};

//'read' controller method to display a nurse
exports.read = function (req, res) {
    // Use the 'response' object to send a JSON response
    res.json(req.nurse);
};

exports.update = function (req, res, next) {
    console.log(req.body);
    Nurse.findByIdAndUpdate(
        req.nurse._id,
        req.body,
        function (err, nurse) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.json(nurse);
        }
    );
};

// delete a nurse by id
exports.delete = function (req, res, next) {
    Nurse.findByIdAndRemove(
        req.nurse.id,
        req.body,
        function (err, nurse) {
            if (err) return next(err);
            res.json(nurse);
        }
    );
};

//list tip that a nurse created
exports.listTipsByNurseId = function (req, res) {
    //find tips by creator ID
    MotivationalTip.find(
      {creator: req.nurse._id},
      (err, tips) => {
        if (err) return getErrorMessage(err);      
        return res.send(200).json(tips)        
      })
  };

//The hasAuthorization() middleware uses the req.article and req.user objects
//to verify that the current user is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
    if (req.nurse.id !== req.id) {
        return res.status(403).send({
            message: 'Nurse is not authorized',
        });
    }
    next();
};
