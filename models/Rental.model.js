const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const rentalSchema = new Schema(
  {
   
  people: [{ type: Schema.Types.ObjectId, ref: "User" }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  field: { type: Schema.Types.ObjectId, ref: "Field" },
 
  // price: {
  //     type: Number,
  //     // require: true,
  //   },
    time: String,
    start: String,
    comment: String,
  },
  {
    timestamps: true,
  }
);

const Rental = model("Rental", rentalSchema);

module.exports = Rental;