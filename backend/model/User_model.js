const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
    id:{
        type:Number,
        default:1000,
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
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
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    address: {
        type: String
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    role: {
        type: String,
        enum: ['Member', 'Trainer','Admin'],
        required: true
    },
    trainer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Optional fields for trainers
    expertise: {
        type: String
    },
    experience: {
        type: Number
    },
    certifications: {
        type: [String]
    },
    passwordResetToken: { 
        type: String 
    },
    passwordResetExpires: { 
        type: Date 
    },
},{timestamps:true});

userSchema.plugin(AutoIncrement, { inc_field: "id" });

const User = mongoose.model('User', userSchema);
module.exports = User;
