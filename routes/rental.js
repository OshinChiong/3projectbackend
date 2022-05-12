var express = require("express");
var router = express.Router();
const Rental = require("../models/Rental.model");
const User = require("../models/User.model");
const Field = require("../models/Field.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/:rentalId", isLoggedIn, function (req, res, next) {
    Rental.findById(
         req.params.rentalId
    )
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
  
    router.post("/create", isLoggedIn, function (req, res, next) {
        const {  time, date, size, price, paymentId } = req.body;
        const field = req.body.fieldId;
        const user = req.userId;
      
        Rental.create({
            user,
            time,
            date,
            size,
            price,
            paymentId,
        })
          .then((rentalData) => {
            User.updateOne(
              { username: req.user.username },
              { $push: { rental: [rentalData._id] },
              }
            )
            .then(() => {
              res.json({
                success: true,
                rental: rentalData,
              });
            })
            .catch((err) => {
              res.json(err);
            });
        })
        .catch((err) => {
          res.json(err.message);
        });
    });
     
      
      router.post("/:rentalId", isLoggedIn, function (req, res, next) {
        const user = req.user._id ;
        const { field, time, date, players, size , price, paymentId } = req.body;
       
        Rental.findByIdAndUpdate(
          req.params.rentalId,
          {
            user,
            time,
            date,
            field,
            size,
            price,
            paymentId,
            players
          },
          { new: true }
        )
          .then((foundRental) => {
            res.json({
              success: true,
              rental: foundRental,
            });
          })
          .catch((err) => {
            res.json(err.message);
          });
      });
       
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

      router.get("/:rentalId/edit" , isLoggedIn, (req, res) => {
        Rental.findById(req.params.rentalId)
        .then((foundRental) => {
          res.json("addUser", { rentalData: foundRental });
        })
        .catch((err) => {
          res.json(err.message);
        });
      })
      
      router.post("/:rentalId/edit", isLoggedIn, (req, res) => {
        console.log(req.body)
        Rental.findByIdAndUpdate(req.params.rentalId, {
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
                message: "Reservation Updated"
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
          res.json("addUser", { rentalData: rentalData });
        })
        .catch((err) => {
          res.json(err.message);
        });
    })
      
      router.post("/:rentalId/addUser", isLoggedIn, (req, res) => {
        //  User.create(req.body)

        Rental.findByIdAndUpdate(req.params.rentalId,  {
          $push: {
            people: req.user._id,
          },
        },
        { new: true })
        .then((rentalData) => {
          console.log("RENTAL", rentalData)
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
                message: "Player added"
              });
            })
            .catch((err) => {
              console.log("Need to add more users", err.message);
              res.json(err);
            });
        });
      });

      module.exports = router;

  