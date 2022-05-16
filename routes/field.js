var express = require("express");
var router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Field = require("../models/Field.model");

    router.get("/:fieldId", function (req, res, next) {
      Field.findById(req.params.fieldId)
      .populate({
      path: "rental",
      populate: {
        path: "user",
      },
      })
        .then((fieldOptions) => {
          res.json({field: fieldOptions});
        })

        .catch((err) => {
          res.json( err.message);
        });
    });
     
    router.get("/:allFields", function (req, res, next) {
      Field.findById(req.params.fieldId)
      .populate({
      path: "rental",
      populate: {
        path: "user",
      },
      })
        .then((allFields) => {
          res.json({field: allFields});
        })
        
        .catch((err) => {
          res.json( err.message);
        });
    });
  
    
 
  module.exports = router;