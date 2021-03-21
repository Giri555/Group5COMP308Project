// Create a new 'render' controller method
exports.render = function (req, res) {
    // Use the 'response' object to render the 'index' view
    res.render('index');
};
