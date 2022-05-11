const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const rentalSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    people: {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      field: [{ type: Schema.Types.ObjectId, ref: "Field" }],
  },
    field: {
      type: String,
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