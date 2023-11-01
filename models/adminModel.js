const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

//validate mobile number
function isValid_Mobile_Number(mobile_number) {
    let regex = new RegExp(/(0|91)?[6-9][0-9]{9}/);
    if (mobile_number == null) {
        return "false";
    }
    if (regex.test(mobile_number) == true) {
        return "true";
    }
    else {
        return "false";
    }
}

const adminSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        validate: [isValid_Mobile_Number, "Enter valid phone number."],
        required: true
    },
});

//Generating JWT token
adminSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


//Generating password reset token
adminSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //Hashing and adding to resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;