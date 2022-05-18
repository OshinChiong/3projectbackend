var express = require("express");
var router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Field = require("../models/Field.model");

    router.get("/:id/reservationDetails", function (req, res, next) {
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
     
    // router.get("/allFields", function (req, res, next) {
    //   Field.find()
    //   .populate({
    //   path: "rental",
    //   populate: {
    //     path: "user",
    //   },
    //   })
    //     .then((allFields) => {
    //       res.json({field: allFields});
    //     })
        
    //     .catch((err) => {
    //       res.json( err.message);
    //     });
    // });


    router.get("/view-all", (req, res) => {
      Field.find()
      // Field.find({ creatorId: req.user._id })
        .then((FieldId) => {
          res.json(FieldId);
        })
        .catch((err) => {
         res.json(err.message);
        });
    });
    
    router.get("/view", isLoggedIn, (req, res) => {
      Field.findById(req.user._id)
        .then((foundField) => {
          res.json(foundField);
        })
        .catch((err) => {
          res.json(err.message);
        });
    });

    router.post("/create", isLoggedIn, (req, res) => {
      Field.create({
        size: req.body.size,
        time: req.body.time,
        price: req.body.price,
        players: req.body.players,
        creatorId: req.user._id,
        // created: req.body.create,
        // lastUpdate: req.body.lastUpdate,
        username: req.body.username,
      })
        .then((createdField) => {
          res.json(createdField);
        })
        .catch((err) => {
          res.json(err.message);
        });
    });
  
    
 
  module.exports = router;