const mongoose = require("mongoose");
const MotivationalTip = mongoose.model("MotivationalTip");
const Nurse = mongoose.model("Nurse");
const Patient = mongoose.model("Patient");

function getErrorMessage(err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
}
//create tip without specifying patient
exports.create = function (req, res) {
  console.log("create tips here");
  const motivationalTip = new MotivationalTip();
  motivationalTip.title = req.body.title;
  motivationalTip.content = req.body.content; 
 
console.log(req.nurseId);
  Nurse.findOne({ _id: req.nurseId }, (err, nurse) => {
    if (err) {
      return getErrorMessage(err);
    }
    req.id = nurse._id;
    console.log(nurse);
  }).then(function () {
    motivationalTip.creator = req.id;
    motivationalTip.save((err, motivationalTip) => {
      if (err) {
        console.log("error", getErrorMessage(err));
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        res.status(200).json(motivationalTip);
      }
    });
 });
};

//list all tips that a specific nurse created
exports.listTipsByNurseId= function(req,res){
  console.log('current nurse: '+req.nurse);
  MotivationalTip.find({creator: req.nurseId})
  .populate("creator", "firstName lastName")
  .exec((err, tips) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err),
      });
    } else {
      res.status(200).json(tips);
    }
  });
}

//list all tips without knowing who is the creator
//unncessary
exports.list = function (req, res) {
    MotivationalTip.find()
      .populate("creator", "firstName lastName")
      .exec((err, tips) => {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err),
          });
        } else {
          res.status(200).json(tips);
        }
      });
  };

exports.read = function (req, res) {
  res.status(200).json(req.motivationalTip);
};
//update tips
exports.update = function (req, res) {
  const motivationalTip = req.motivationalTip;
  motivationalTip.content = req.body.content;
  motivationalTip.title = req.body.title;

  motivationalTip.save((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err),
      });
    } else {
      res.status(200).json(motivationalTip);
    }
  });
};

exports.delete = function (req, res) {
  const motivationalTip = req.motivationalTip;
  motivationalTip.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err),
      });
    } else {
      res.status(200).json(motivationalTip);
    }
  });
};
//send motivational tip to patientId
exports.sendTip=function(req,res) {
  console.log('current tip: '+req.motivationalTip)
    const motivationalTip=req.motivationalTip;
// find patient, 
//then push the tip to tipList of Patient
Patient.findOne({_id:req.params.patientId },(err,patient)=>{
    if(err) return getErrorMessage(err);
    patient.motiTipList.push(motivationalTip);
      patient.save((err,patient)=>{
        if(err) return res.status(400).send({
            message: getErrorMessage(err)
        });
        console.log(patient);
        res.status(200).json(patient);
})})
};

exports.motivationalTipById = function (req, res, next, id) {
  MotivationalTip.findById(id)
    .populate("creator", "firstName lastName")
    .exec((err, motivationalTip) => {
      if (err) return next(err);
      if (!motivationalTip) return next(new Error("Failed to load motivationalTip " + id));
      req.motivationalTip = motivationalTip;
      next();
    });
};

//The hasAuthorization() middleware uses the req.article and req.user objects
//to verify that the current user is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
  console.log(req.motivationalTip.creator);
  if (req.motivationalTip.creator.id !== req.id) {
    return res.status(403).send({
      message: "User is not authorized",
    });
  }
  next();
};
