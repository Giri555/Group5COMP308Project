const mongoose = require("mongoose");
const coursesServerRoutes = require("../routes/courses.server.routes");
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
  const motivationalTip = new MotivationalTip();
  motivationalTip.title = req.body.title;
  motivationalTip.content = req.body.content; 

  Nurse.findOne({ email: req.body.email }, (err, nurse) => {
    if (err) {
      return getErrorMessage(err);
    }
    req.id = nurse._id;
    console.log(nurse);
  }).then(function () {
    motivationalTip.creator = req.id;
    motivationalTip.save((err) => {
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
//list all tips without knowing who is the creator
//this for testing purpose, not for front end
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
  motivationalTip.section = req.body.content;
  motivationalTip.semester = req.body.title;

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
    const motivationalTip=req.motivationalTip;
// find patient, 
//then push the tip to tipList of Patient
Patient.findOne({_id:req.patient._id },(err,patient)=>{
    if(err) return getErrorMessage(err);
    patient.motiTipList.push(motivationalTip);
}).then(function(){    
    patient.save((err,patient)=>{
        if(err) return res.status(400).send({
            message: getErrorMessage(err)
        });
        res.status(200).json(patient);
    })
})
}

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

// exports.findCoursesByStudentNumber = function (req, res) {
//   //find student, then find courses
//   Student.findOne(
//     {studentNumber: req.params.studentNumber},
//     (err, student) => {
//       if (err) return getErrorMessage(err);      
//       req.id = student._id;
//       console.log(req.id);
//     }
//   )
//   .then(function(){
//       Course.find({creator: req.id}).exec(function(err,courses){
//           if(err){
//               if(err.kind === "ObjectId"){
//                   return res.status(404).send({ message: "Courses not found with the given student number"})
//               }
//               return res.status(500).send({message:"Error retrieving Course with given Student Id "})
//           }
//           res.send(courses);
//       })
//     }
//   );
// };

// exports.addStudentToACourse1 = function (req, res) {

//   const course=req.course;
//   console.log(course);
//   Student.findOne({_id: req.student._id},(err,student)=>{
//     if(err) return getErrorMessage(err);
//     req.student=student;
//     console.log(student);
//   }).then(function(){
//     course.studentList.push(req.student);
//     course.save((err,course)=>{
//       if(err) return res.status(400).send({
//         message: getErrorMessage(err)
//       });
//       else{
//         res.status(200).json(course);
//       }
//     });
//   })
// };

//The hasAuthorization() middleware uses the req.article and req.user objects
//to verify that the current user is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
  if (req.motivationalTip.creator.id !== req.id) {
    return res.status(403).send({
      message: "User is not authorized",
    });
  }
  next();
};
