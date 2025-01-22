const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);


// schema for Gym trainer
const trainer_Schema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    first_name: { 
        type: String, 
        //required: true 
    },
    last_name: { 
        type: String, 
        //required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
        validate: {
          validator: async function (v) {
            // Check if the email already exists in the database
            const user = await this.constructor.findOne({ email: v });
            if (user) {
              // If the current document is being updated, ensure it's not checking against itself
              if (this._id && this._id.equals(user._id)) {
                return true;
              }
              return false;
            }
            return true;
          },
          message: "Email already exists!",
        },
    },
    phone_number: { 
        type: String, 
        required: true 
    },
    dob: { 
        type: Date,
    },
    gender: { 
        type: String, 
        enum: ["Male", "Female", "Other"], 
        //required: true 
    },
    address: { 
        type: String, 
    },
    state: { 
        type: String,
    },
    city: { 
        type: String, 
    },
    joining_date: { 
        type: Date, 
        default:Date.now 
    },
    expertise: { 
        type: String,
    },
    certifications: { 
        type: String 
    },
    experience: { 
        type: Number, 
    },
    is_admin: { 
        type: Boolean, 
        default:false 
    },
    assigned_members: [{ type: mongoose.Schema.Types.ObjectId, ref: "GymMember" }],
  });


//export the employee schema
const Trainer = mongoose.model("Trainer",trainer_Schema);
module.exports = Trainer;