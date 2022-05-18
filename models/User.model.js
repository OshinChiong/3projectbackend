const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
     
    password: {
        type: String,
        require: true,
        
    },
    rental: [{ type: Schema.Types.ObjectId, ref: "Rental" }],

},
{
    timeseries: true,
    timestamps: true
}
);


const User = model("User", userSchema);

module.exports = User;