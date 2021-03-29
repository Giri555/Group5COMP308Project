// Load the 'nurses' controller
const NurseController = require('../../app/controllers/nurse.server.controller');

// Define the routes module' method
module.exports = function (app) {
    /* 
        Set up the 'nurseId' parameter middleware
        All param callbacks will be called before any handler of
        any route in which the param occurs, and they will each
        be called only once in a request - response cycle,
        even if the parameter is matched in multiple routes 
    */
    app.param('nurseId', NurseController.nurseByID);

    // authenticate nurse
    app.post('/api/nurse/sign-in', NurseController.authenticate);
    app.get('/api/nurse/sign-out', NurseController.signout);
    app.get('/api/nurse/read-cookie', NurseController.isSignedIn);

    app.get('/api/nurse/listNurses', NurseController.list);

    app.post('/api/nurse/sign-up', NurseController.create);

    app.route('/api/nurses/:nurseId')
        .get(NurseController.read)
        .put(
            NurseController.requiresLogin,
            NurseController.hasAuthorization,
            NurseController.update
        )
        .delete(
            NurseController.requiresLogin,
            NurseController.hasAuthorization,
            NurseController.delete
        );
};
