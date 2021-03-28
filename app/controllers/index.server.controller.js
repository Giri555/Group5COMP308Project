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

// handles sign out
// exports.signOut = function (req, res) { }