var express = require("express");
var router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploaded = require('../middleware/cloudinary.config');
const saltRounds = 10;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", function (req, res, next) {
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }
  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "Username is taken" });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        User.create({
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
        })
          .then((createdUser) => {
         
            const payload = { _id: createdUser._id };

            const token = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "24hr",
            });

            res.json({ token: token });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/login", function (req, res, next) {

  if (!req.body.username || !req.body.password) {
    return res.json({ message: "Please fill out all fields" });
  }

  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      if (!foundUser) {
        return res.json({ message: "Username or password incorrect" });
      }


      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );

      if (doesMatch) {
  
        const payload = { _id: foundUser._id };
        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr",
        });

        res.json({ token: token });
      } else {
        return res.json({ message: "Username or password incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/login-test", isLoggedIn, (req, res) => {
  console.log("USER", req.user);
  res.json({ message: "You are logged in" });
});

router.post('/delete-user', isLoggedIn, (req, res, next) => {
  User.findById(req.user._id) 
    .then(foundUser=>{
      const doesMatch = bcrypt.compareSync(req.body.password, foundUser.password)
      if (doesMatch) {
        foundUser.delete()
        res.json({message: "success"})
      } else {
        res.status(401).json({message: "password doesn't match"})
      }
    })
    .catch(error=>{
      res.status(400).json(error.message)
    })
  });

// router.get("/new-post",isLoggedIn, function (req, res, next) {
//   res.render("create-post");
// });






module.exports = router;