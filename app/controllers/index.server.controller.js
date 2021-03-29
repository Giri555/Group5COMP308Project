// renders the api index page
exports.renderIndex = function (req, res) {
    // Use the 'response' object to render the 'index' view
    res.render('index');
};

// handles sign up
exports.signUp = function (req, res) {
    let email = req.body.email;
    if (email.includes('@nurse.ca')) {
        // handle nurse sign up
        console.log(`process nurse sign up: ${email}`);
        res.redirect(307, '/api/nurse/sign-up'); // 307 - preserve the send method with redirect
    } else {
        // handle patient sign up
        console.log(`process patient sign up: ${email}`);
        res.redirect(307, '/api/patient/sign-up');
    }
};

// handles sign in
exports.signIn = function (req, res) {
    let email = req.body.email;
    if (email.includes('@nurse.ca')) {
        // handle nurse sign in
        console.log(`process nurse sign in: ${email}`);
        res.redirect(307, '/api/nurse/sign-in');
    } else {
        // handle patient sign in
        console.log(`process patient sign in: ${email}`);
        res.redirect(307, '/api/patient/sign-in');
    }
};

// handles sign out                                     ***** (requires testing) *****
exports.signOut = function (req, res) {
    console.log(`Index - sign out request`);
    console.log(`req.cookies.patientToken: ${req.cookies.patientToken}`);
    console.log(`req.cookies.nurseToken: ${req.cookies.nurseToken}`);

    let userIsNurse = req.cookies.nurseToken ? true : false;
    console.log(`The user is a nurse? : ${userIsNurse}`);

    if (userIsNurse) {
        // handle nurse sign out
        console.log(`process nurse sign out`);
        res.redirect(307, '/api/nurse/sign-out');
    } else {
        // handle patient sign out
        console.log(`process patient sign out`);
        res.redirect(307, '/api/patient/sign-out');
    }
};
