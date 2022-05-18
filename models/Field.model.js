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
  
    price: {
        type: Number,
        // require: true,
        
    },
  

    players: {
        type: Number,
        require: true,   
    },

        // user: { type: Schema.Types.ObjectId, ref: "User" },
        rental: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
    
    
},
{
    timestamps: true,
  }

);


const Field = model("Field", fieldSchema);

module.exports = Field;