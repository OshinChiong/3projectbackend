const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const rentalSchema = new Schema(
  {
   
  people: [{ type: Schema.Types.ObjectId, ref: "User" }],
  field: [{ type: Schema.Types.ObjectId, ref: "Field" }],
  size: {
      type: String,
      enum: ["Small 14 players", "Medium 18 players", "Large 22 players"],
      require: true
    },
  price: {
      type: Number,
      // require: true,
    },
    time: String,
    date: String,
    paymentId: String,
  },
  {
    timestamps: true,
  }
);

const Rental = model("Rental", rentalSchema);

module.exports = Rental;