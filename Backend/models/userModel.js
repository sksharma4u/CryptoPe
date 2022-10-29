const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        maxLength: [30, "Name cannot Exceed 30 Character"],
        minLength: [4, "Name Should have more than 4 charcters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true, // Verify that same mail nhi hone chaiye
        validate: [validator.isEmail, "Please Enter a valid Email"] // verify that is it correct email or not
    },
    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minLength: [8, "Password Should have more than 8 charcters"],
        select: false, // It means password is hide when admin wants to see the details of All the users inside the database
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    role: {
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); // Convert the password in hash (bycrpt the password)
});

//JWT TOKEN  --> Which verifies that the user who register is allow to login directly 

// Basically hum  token genrate krnge and than store into the cookies .

userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//Compare Password

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
module.exports = mongoose.model("User", userSchema);