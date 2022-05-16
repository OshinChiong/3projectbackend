var express = require('express');
var router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

const Field = require('../models/Field.model');
const fileUploaded = require('../middleware/cloudinary.config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/new-field', isLoggedIn, fileUploaded, function(req, res, next) {
 
//   res.json(req.file)
// });

// Field.create({
//   user,
//   time,
//   date,
//   size,
//   price,
//   paymentId,
// })
// .then((rentalData) => {
//   User.updateOne(
//     { username: req.user.username },
//     { $push: { rental: [rentalData._id] },
//     }
//   )
//   .then(() => {
//     res.json({
//       success: true,
//       rental: rentalData,
//     });
//   })
//   .catch((err) => {
//     res.json(err);
//   });
// })
// .catch((err) => {
// res.json(err.message);
// });



module.exports = router;
