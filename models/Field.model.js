const { Schema, model } = require("mongoose");

const fieldSchema = new Schema({
    description: {
        type: String,
      },
      time: {
        type: Number,
        require: true,
        
    },
     
    date: {
        type: Number,
        require: true,
        
    },
    price: {
        type: Number,
        require: true,
        
    },
    paymentOptions: [
        {
          type: String,
        },
      ],

    players: {
        type: Number,
        require: true,   
    },
    people: {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        field: [{ type: Schema.Types.ObjectId, ref: "Field" }],
    },
    
},
{
    timestamps: true,
  }

);


const Field = model("Field", fieldSchema);

module.exports = Field;