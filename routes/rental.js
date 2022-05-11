var express = require("express");
var router = express.Router();
const Rental = require("../models/Rental.model");
const User = require("../models/User.model");
const Field = require("../models/Field.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/:rentalId", isLoggedIn, function (req, res, next) {
    Rental.findOne({
        _id: req.params.rentalId,
        user: req.user._id
    })
    .then((foundRental))
    if (foundRental) {
       return res.json ({
           message: "you need to make a reservation"
        });
    }
})
    // .catch((err) => {
    //     res.json(err.message)
    // });


    router.post("/create", isLoggedIn, function (req, res, next) {
        const {  time, date, description, price, paymentId } = req.body;
        const field = req.body.fieldId;
        const user = req.userId;
      
        Rental.create({
            user,
            time,
            date,
            description,
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
              next(err);
            });
        })
        .catch((err) => {
          res.json(err.message);
        });
    });
     
      
      router.post("/:rentalId", isLoggedIn, function (req, res, next) {
        const { field, time, date, description, players , price, paymentId } = req.body;
        const user = req.user._id ;
      
        Rental.findByIdAndUpdate(
          req.params.rentalId,
          {
            user,
            time,
            date,
            description,
            price,
            paymentId,
            players
          },
          { new: true }
        )
          .then((foundRental) => {
            res.json({
              success: true,
              rental: rental,
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
      
      router.post("/:rentalId/edit", isLoggedIn, (req, res) => {
        Rental.findByIdAndUpdate(req.params.rentalId, {
          user: req.body.user,
          description: req.body.description,
        })
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
          next(err);
        });
    })
    // .catch((err) => {
    //   res.json(err.message);
    // });



     // router.post("/:rentalId/add-player", isLoggedIn, (req, res) => {
      //   Player.create({
      //     user: req.session.user._id,
      //   })
      //     .then((addedPlayer) => {
      //       Rental.findByIdAndUpdate(req.params.id, {
      //         $push: { field: addedPlayer._id },
      //       })
      //         .then((results) => {
      //           res.redirect("/influencers/influencers");
      //         })
      //         .catch((err) => {
      //           res.json(err.message);
      //         });
      //     })
      //     .catch((err) => {
      //       console.log("Failed to added player", err.message);
      //       res.json(err.message);
      //     });
      // });
   
      router.post("/addUser/:userId", (req, res) => {
        User.create(req.body).then((rentalData) => {
          User.updateOne(
            { username: req.user.username },
            {
              $push: {
                rental: [userData._id],
              },
            }
          )
            .then(() => {
              res.json({
                success: true,
                rental: userData,
                user: userData,
              });
            })
            .catch((err) => {
              console.log("Need to add more users", err.message);
              next(err);
            });
        });
      });
    

      module.exports = router;