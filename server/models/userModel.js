const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

function isPhoneNumber(inputtxt) {
    var phoneno = /^\d{10}$/;
    if (inputtxt.value.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
};

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        validate: [isPhoneNumber, 'Please enter a valid phone number!'],
        required: true
    },
    name: {
        type: String,
    },
    gender: {
        type: String,
    },
    age: {
        type: Number,
    },
    location: {
        type: String
    },
     appearances: [
        {
            publicId: {
                type: String
            },
            eTag: {
                type: String
            },
            resultUrl: {
                type: String
            }
        }
    ],
    bio: {
        type: String
    },
    education: {
        type: String
    },
    musicAndEntertainment: {
        type: String
    },
    languagesSpoken: [
        {
            type: String
        }
    ],
    occupation: {
        type: String
    },
    interestsAndHobbies: [
        {
            type: String,
        }
    ],
    lifeStyle: {
        type: String
    },
    relationshipGoals: {
        type: String
    },
    dealBreakersAndPreferences: {
        type: String
    },
    height: {
        type: String
    },
    bodyType: {
        type: String
    },
    religion: {
        type: String
    },
    politicalViews: {
        type: String
    },
    locationPreferences: [
        {
        type: String
        }
    ],
    likeToDate: [
        {
            type: String
        }
    ],
    pets: {
        type: String
    },
    // role: {
    //     type: String,
    //     default: 'user',
    // },
    // subscriptionEndDate: {
    //     type: Date,
    // },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
})



//Generating JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


//Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
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

const User = mongoose.model('User', userSchema);
module.exports = User;
