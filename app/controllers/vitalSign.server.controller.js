const mongoose = require('mongoose');
const VitalSigns = mongoose.model('VitalSign');
// const Nurse = mongoose.model('Nurse');
const Patient = mongoose.model('Patient');

function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
}

// set up 'vitalSignsId' parameter middleware
exports.vitalSignsById = function (req, res, next, id) {
    VitalSigns.findOne(
        {
            _id: id,
        },
        (err, vitalSigns) => {
            if (err) {
                // Call the next middleware with an error message
                return next(err);
            } else {
                req.vitalSigns = vitalSigns;
                console.log(vitalSigns);
                // Call the next middleware
                next();
            }
        }
    );
};

// ######  Nurse's requirements: (Vital Signs)  ######

// NR1) nurse needs to update a specific patient document, with their required vital signs
exports.updatePatientsRequirements = function (req, res, next) {
    const requirements = req.body.requirements;

    Patient.findByIdAndUpdate(
        req.params.patientId,
        { requirements: requirements },
        { useFindAndModify: false, new: true },
        function (err, patient) {
            if (err) {
                console.log(`findByIdAndUpdate error: ${err}`);
            } else {
                if (!patient) {
                    console.log(`fail: patient was NOT found`);
                    res.status(404).json({
                        status: '404 - patient not found',
                        message: 'Please try again, patient not found',
                        data: null,
                    });
                    return next();
                } else {
                    console.log(
                        `success: here is the updated patient doc: ${patient}`
                    );
                    res.status(200).json({
                        status: '200 - patient found and updated',
                        message:
                            'Patient vital signs were updated successfully',
                        data: patient,
                    });
                }
            }
        }
    );
};

// NR2) nurse needs to create a vital signs document for a specific patient
exports.create = function (req, res, next) {
    console.log(`in the create export`);
    var vitalSigns = new VitalSigns(req.body);
    console.log(vitalSigns);

    // save the vital signs doc
    vitalSigns.save(function (err) {
        if (err) {
            console.log(`NR2 - error saving doc`);
            return next(err);
        } else {
            console.log(`NR2 - success - vital signs doc created`);
            req.vitalSigns = vitalSigns;
        }
    });

    // push the vital signs doc to the list
    console.log(`this is the vital signs id:  ${vitalSigns._id}`);
    console.log('this is the patient id: ', req.params.patientId);
    const patient_id = req.params.patientId;
    Patient.findOne({ _id: patient_id }, (err, patient) => {
        if (err) {
            console.log(`NR2 - error in patient.findone`);
            return getErrorMessage(err);
        }
        patient.vitalSignsList.push(vitalSigns);
        patient.save();
        res.status(200).json({
            status: '200 - vital signs appended',
            message: 'Vital signs added for patient',
            data: patient,
        });
    });
};

// NR3) nurse needs to read a specific vital signs document for a specific patient
exports.read = function (req, res) {
    const vitalSigns = req.vitalSigns;
    if (vitalSigns) {
        res.status(200).json({
            status: '200 - vital signs read',
            message: 'Vital signs read for patient',
            data: {
                vitalSigns: req.vitalSigns,
                patient: req.patient,
            },
        });
    } else {
        res.status(200).json({
            status: '200 - vital signs not found',
            message: 'Vital signs not found',
            data: {
                vitalSigns: req.vitalSigns,
                patient: req.patient,
            },
        });
    }
};

// NR4) nurse needs to update a specific vital signs document for a specific patient
exports.update = function (req, res, next) {
    console.log(req.body);
    VitalSigns.findByIdAndUpdate(
        req.vitalSigns.id,
        req.body,
        { useFindAndModify: false, new: true },
        function (err, vitalSigns) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.status(200).json({
                status: '200 - vital signs updated',
                message: 'Vital signs updated for patient',
                data: req.patient,
            });
        }
    );
};

// NR5) nurse needs to delete a specific vital signs document for a specific patient
// contains 2 delete operations:
//      a) delete doc from the vitalsigns collection
//      b) delete the object ref from the vitalSignsList from the patient model
exports.delete = function (req, res, next) {
    // a) delete doc from the vitalsigns collection
    VitalSigns.findByIdAndRemove(
        req.vitalSigns.id,
        req.body,
        function (err, vitalSigns) {
            if (err) return next(err);
            console.log(`vital signs doc removed`);
        }
    );

    // b) delete the object ref from the vitalSignsList from the patient model
    const patient_id = req.params.patientId;
    Patient.findOne({ _id: patient_id }, (err, patient) => {
        if (err) {
            console.log(`NR5 - error in patient.findone`);
            return getErrorMessage(err);
        }
        const index = patient.vitalSignsList.indexOf(req.params.vitalSignsId);
        if (index > -1) {
            patient.vitalSignsList.splice(index, 1);
        }
        patient.save();
        res.status(200).json({
            status: '200 - vital signs doc removed from list',
            message: 'Vital signs removed for patient',
            data: patient,
        });
    });
};

// NR6) nurse needs to list all the vital signs documents they made for a specific patient
exports.list = function (req, res) {
    res.status(200).json({
        vitalSignsList: req.patient.vitalSignsList,
    });
};

// ######  Patient's requirements: (Daily Information)  ######

// PR1) patient needs to create a daily information document, for the vital signs required by the nurse
exports.createDailyInfo = function (req, res, next) {
    console.log(`in the create export`);
    var dailyInfo = new VitalSigns(req.body);
    console.log(dailyInfo);

    // save the vital signs doc
    dailyInfo.save(function (err) {
        if (err) {
            console.log(`PR1 - error saving doc`);
            return next(err);
        } else {
            console.log(`PR1 - success - daily info doc created`);
            req.dailyInfo = dailyInfo;
        }
    });

    // push the daily info doc to the list
    const patient_id = req.params.patientId;
    Patient.findOne({ _id: patient_id }, (err, patient) => {
        if (err) {
            console.log(`PR1 - error in patient.findone`);
            return getErrorMessage(err);
        }
        patient.dailyInfoList.push(dailyInfo);
        patient.save();
        res.status(200).json({
            status: '200 - daily info appended',
            message: 'Daily Info added by patient',
            data: patient,
        });
    });
};

// PR2) patient needs to read a daily information document
exports.readDailyInfo = function (req, res) {
    const dailyInfo = req.vitalSigns;
    if (dailyInfo) {
        res.status(200).json({
            status: '200 - daily info read',
            message: 'Daily info read by patient',
            data: {
                dailyInfo: dailyInfo,
                patient: req.patient,
            },
        });
    } else {
        res.status(200).json({
            status: '200 - daily info not found',
            message: 'Daily info not found',
            data: {
                dailyInfo: dailyInfo,
                patient: req.patient,
            },
        });
    }
};

// PR3) patient needs to update a daily information document (in case they made an error)
exports.updateDailyInfo = function (req, res, next) {
    console.log(req.body);
    VitalSigns.findByIdAndUpdate(
        req.vitalSigns.id,
        req.body,
        { useFindAndModify: false, new: true },
        function (err, vitalSigns) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.status(200).json({
                status: '200 - daily info updated',
                message: 'daily info updated by patient',
                data: req.patient,
            });
        }
    );
};

// PR4) patient needs to delete a daily information document
// contains 2 delete operations:
//      a) delete doc from the vitalsigns collection
//      b) delete the object ref from the dailyInfoList from the patient model
exports.deleteDailyInfo = function (req, res, next) {
    // a) delete doc from the vitalsigns collection
    VitalSigns.findByIdAndRemove(
        req.vitalSigns.id,
        req.body,
        function (err, vitalSigns) {
            if (err) return next(err);
            console.log(`vital signs doc removed`);
        }
    );

    // b) delete the object ref from the dailyInfoList from the patient model
    const patient_id = req.params.patientId;
    Patient.findOne({ _id: patient_id }, (err, patient) => {
        if (err) {
            console.log(`NR5 - error in patient.findone`);
            return getErrorMessage(err);
        }
        const index = patient.dailyInfoList.indexOf(req.params.vitalSignsId);
        if (index > -1) {
            patient.dailyInfoList.splice(index, 1);
        }
        patient.save();
        res.status(200).json({
            status: '200 - vital signs doc removed from dailyInfoList',
            message: 'Vital signs removed for patient',
            data: patient,
        });
    });
};

// PR5) patient needs to list all the daily information documents that they have created
exports.listDailyInfo = function (req, res) {
    res.status(200).json({
        dailyInfoList: req.patient.dailyInfoList,
    });
};

