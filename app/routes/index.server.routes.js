// Load the controller(s)
const IndexController = require('../controllers/index.server.controller');

// Define the routes module method
module.exports = function (app) {
    // show the api 'index' page if a GET request is made to root
    app.route('/').get(IndexController.renderIndex);

    // process sign up request and redirect to appropriate route
    app.post('/api/index/sign-up', IndexController.signUp);

    // process sign in request and redirect to appropriate route
    app.post('/api/index/sign-in', IndexController.signIn);

    // process sign out request
    app.get('/api/index/sign-out', IndexController.signOut);
};
