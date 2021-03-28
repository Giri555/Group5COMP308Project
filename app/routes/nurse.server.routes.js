// Load the 'nurses' controller
var nurses = require('../../app/controllers/nurse.server.controller');

// Define the routes module' method
module.exports = function (app) {
    /* 
        Set up the 'studentId' parameter middleware
        All param callbacks will be called before any handler of
        any route in which the param occurs, and they will each
        be called only once in a request - response cycle,
        even if the parameter is matched in multiple routes 
    */
    app.param('nurseId', nurses.nurseByID);

    // authenticate nurse
    app.post('/signin', nurses.authenticate);
    app.get('/signout', nurses.signout);

    app.route('/api/nurses')
        .get(nurses.list)
        .post(nurses.create);

    app.route('/api/nurses/:nurseId')
        .get(nurses.read)
        .put(nurses.requiresLogin, nurses.hasAuthorization, nurses.update)
        .delete(nurses.requiresLogin, nurses.hasAuthorization, nurses.delete);
};

