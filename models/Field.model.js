const { Schema, model } = require("mongoose");

const fieldSchema = new Schema({
    size: {
        type: String,
        enum: ["Small 14 players", "Medium 18 players", "Large 22 players"],
        require: true
      },
      time: {
        type: String,
        require: true,
        
    },
     
    date: {
        type: String,
        require: true,
        
    },
    price: {
        type: Number,
        // require: true,
        
    },
    // paymentOptions: [
    //     {
    //       type: String,
    //     },
    //   ],

    players: {
        type: Number,
        require: true,   
    },
    rental: {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rental: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
    },
    
},
{
    timestamps: true,
  }

);


const Field = model("Field", fieldSchema);

module.exports = Field;