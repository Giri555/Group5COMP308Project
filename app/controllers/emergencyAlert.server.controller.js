const mongoose = require('mongoose');
const EmergencyAlert = mongoose.model('EmergencyAlert');
const Patient = require('mongoose').model('Patient');
//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
//
exports.create = function (req, res) {
    const emergencyAlert = new EmergencyAlert();
    emergencyAlert.title = req.body.title;
    console.log(req.body)

    Patient.findOne({email: req.body.email}, (err, patient) => {
        if (err) { return getErrorMessage(err); }
        req.id = patient._id;
        console.log('patient._id',req.id);
    }).then( function () 
    {
        emergencyAlert.creator = req.id
        console.log('req.patient._id',req.id);

        emergencyAlert.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err))

                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(emergencyAlert);
            }
        });
    
    });
};

exports.list = function (req, res) {
    EmergencyAlert.find().sort('-created').populate('patient', 'firstName lastName').exec((err, emergencyAlerts) => {
if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        res.status(200).json(emergencyAlerts);
    }
});
};

exports.emergencyAlertByID = function (req, res, next, id) {
    EmergencyAlert.findById(id).populate('creator', 'firstName lastName fullName').exec((err, emergencyAlert) => {if (err) return next(err);
    if (!emergencyAlert) return next(new Error('Failed to load emergencyAlert '
            + id));
        req.emergencyAlert = emergencyAlert;
        console.log('in emergencyAlertById:', req.emergencyAlert)
        next();
    });
};

exports.read = function (req, res) {
    res.status(200).json(req.emergencyAlert);
};

exports.update = function (req, res) {
    console.log('in update:', req.emergencyAlert)
    const emergencyAlert = req.emergencyAlert;
    emergencyAlert.title = req.body.title;
    emergencyAlert.content = req.body.content;
    emergencyAlert.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(emergencyAlert);
        }
    });
};

exports.delete = function (req, res) {
    const emergencyAlert = req.emergencyAlert;
    emergencyAlert.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(emergencyAlert);
        }
    });
};

//The hasAuthorization() middleware uses the req.emergencyAlert and req.patient objects
//to verify that the current patient is the creator of the current emergencyAlert
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - creator: ',req.emergencyAlert.creator)
    console.log('in hasAuthorization - patient: ',req.id)
    //console.log('in hasAuthorization - patient: ',req.patient._id)


    if (req.emergencyAlert.creator.id !== req.id) {
        return res.status(403).send({
            message: 'Patient is not authorized'
        });
    }
    next();
};
