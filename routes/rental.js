var express = require("express");
var router = express.Router();
const Rental = require("../models/Rental.model");
const User = require("../models/User.model");
const Field = require("../models/Field.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/allRentals/:fieldId", isLoggedIn, (req, res) => {
  Rental.find({ field: req.params.fieldId })
    .then((rentalData) => {
      console.log("RENTALDATA", rentalData);
      res.json({ rentalData: rentalData });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

// Create rental based on field id
router.post("/create/:fieldId", isLoggedIn, function (req, res, next) {
  console.log("!!!!!");
  console.log("BODY", req.body);
  const { time, start } = req.body;
  const field = req.params.fieldId;
  const user = req.user._id;

  Rental.create({
    user: req.user._id,
    time: time,
    start: start,
    field: req.params.fieldId,
  })
    .then((rentalData) => {
      console.log("$$$$$", rentalData);
      User.findByIdAndUpdate(req.user._id, {
        $push: { rental: [rentalData._id] },
      })
        .then((result) => {
          console.log("SUCCESS", result);
          res.json({
            success: true,
            rental: rentalData,
            result,
          });
        })
        .catch((err) => {
          console.log("Something went wrong", err.message);
          res.json(err);
        });
    })
    .catch((err) => {
      console.log("ERR", err.message);
      res.json(err.message);
    });
});

router.get("/view-rental/:fieldId", (req, res) => {
  console.log("WHAT???", req.params)
  Rental.find({field: req.params.fieldId})
    .populate({ path: "user" })
    .then((foundRental) => {
      res.json(foundRental);
      console.log("KKKKK", foundRental);
    })
    .catch((err) => {
      console.log("FAILED", err.message)
      res.status(500).json(err.message);
    });
});

// get single rental id
router.get("/:rentalId/single", isLoggedIn, function (req, res, next) {
  Rental.findById(req.params.rentalId)
    .then((foundRental) => {
      if (foundRental) {
        res.json({
          success: true,
          rental: foundRental,
        });
      } else {
        res.json({
          success: false,
          message: "Rental not found",
        });
      }
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err,
      });
    });
});

// Edit single rental
router.post("/:rentalId/edit", isLoggedIn, function (req, res, next) {
  const user = req.user._id;
  const { field, time, date, players, size, price, start } = req.body;
  console.log("BODY", req.body);
  console.log("START", start);
  console.log("TIME", time);
  console.log("ID", req.params.rentalId);
  Rental.findByIdAndUpdate(
    req.params.rentalId,
    {
      time,
      start,
      // players
    },
    { new: true }
  )
    .then((foundRental) => {
      console.log("SUCCESSs", foundRental);
      res.json({
        success: true,
        rental: foundRental,
      });
    })
    .catch((err) => {
      console.log("SOMETHING WENT WRONG", err.message);
      res.json("ERror", err.message);
    });
});

// Delete rental
router.post("/:rentalId/delete", isLoggedIn, function (req, res, next) {
  Rental.findByIdAndRemove(req.params.rentalId)
    .then((rentalData) => {
      User.updateOne(
        { username: req.user.username },
        {
          $push: {
            rentals: [req.params.rentalId],
          },
        },
        { new: true }
      )
        .then((userData) => {
          res.json({
            success: true,
            rentals: rentalData,
            user: userData,
            message: "Reservation delete",
          });
        })
        .catch((err) => {
          res.json(err.message);
        });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err,
      });
    });
});

router.get("/allRentals", isLoggedIn, (req, res) => {
  Rental.find()
    .then((rentalData) => {
      console.log("RENTALDATA", rentalData);
      res.json({ rentalData: rentalData });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

//View Rentals - calendar API
router.get("/view-calendar", (req, res) => {
  Rental.find({})
    .then((foundCalendar) => {
      res.json(foundCalendar);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});



router.get("/:rentalId/edit", isLoggedIn, (req, res) => {
  Rental.findById(req.params.rentalId)
    .populate({ path: "user" })
    .then((foundRental) => {
      res.json({ rentalData: foundRental });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.post("/:rentalId/edit", isLoggedIn, (req, res) => {
  console.log(req.body);
  Rental.findByIdAndUpdate(
    req.params.rentalId,
    {
      date: req.body.date,
      time: req.body.time,
    },
    { new: true }
  )
    .then((rentalData) => {
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            rentals: [req.params.rentalId],
          },
        },
        { new: true }
      )
        .then((userData) => {
          res.json({
            success: true,
            rentals: rentalData,
            user: userData,
            message: "Reservation Updated",
          });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/:rentalId/addUser", isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .then((rentalData) => {
      res.json({ rentalData: rentalData });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.post("/:rentalId/addUser", isLoggedIn, (req, res) => {
  Rental.findByIdAndUpdate(
    req.params.rentalId,
    {
      $push: {
        people: req.user._id,
      },
    },
    { new: true }
  ).then((rentalData) => {
    // console.log("RENTAL", rentalData);
    User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          rental: rentalData._id,
        },
      },
      { new: true }
    )
      .then((addedUser) => {
        // res.json("addUser", { rentalData: rentalData });
        res.json({
          success: true,
          rental: rentalData,
          user: addedUser,
          message: "Player added",
        });
      })
      .catch((err) => {
        console.log("Need to add more users", err.message);
        res.json(err);
      });
  });
});

module.exports = router;
