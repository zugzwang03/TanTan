const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ErrorHandler = require("../utils/errorHandler.js");
const User = require('../models/userModel.js');
const sendCookie = require('../utils/sendCookie.js');
const cloudinary = require('cloudinary');
const Admin = require('../models/adminModel.js');

const login = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var { phoneNumber } = req.body;
    var admin = await Admin.findOne({ phoneNumber });
    if (admin) {
        return res.status(401).json({
            success: false,
            "error message": "admin phone number already exists with another account"
        })
    }
    admin = await Admin.create({ phoneNumber });
    sendCookie(admin, 200, res);
});

const getUserRegistration = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var { phoneNumber } = req.query;
    var admin = await Admin.findOne({ phoneNumber });
    if (!admin) {
        return res.status(401).json({
            success: false,
            "error message": "admin not logged in yet"
        })
    }
    var user = await User.find({});
    res.status(200).json({
        success: true,
        user
    });
});

const editUserProfile = catchAsyncErrors(async (req, res, next) => {
    // phoneNumberAdmin, phoneNumber, name, gender, age, location, appearances, bio, occupation, education, interestAndHobbies, MusicAndEntertainment, Lifestyle, LanguagesSpoken, relationshipGoals, dealBreakerAndPreferences, height, bodyType, religionAndBeliefs, politicalViews, pets
    var { phoneNumberAdmin, phoneNumber } = req.body;
    var admin = await Admin.findOne({ phoneNumber: phoneNumberAdmin });
    if (!admin) {
        return res.status(401).json({
            success: false,
            "error message": "Admin not logged in yet"
        });
    }
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
    }
    if (req.files) {
        var userAppearances = req.files.appearances;
        if (userAppearances.length) {
            for (const appearance of userAppearances) {
                cloudinary.v2.uploader.upload_stream({ folder: "Tantan", resource_type: 'auto' }, async (error, result) => {
                    if (error) {
                        console.log(error);
                        return next(new ErrorHandler('Some error occurred!', '500'));
                    } else {
                        var newuser = await User.find({ "appearances.eTag": { $in: [result.etag] } });
                        if (newuser.length == 0) {
                            user = await User.findByIdAndUpdate(user._id, { $push: { appearances: { eTag: result.etag, publicId: result.public_id, resultUrl: result.secure_url } } },
                                { new: true });
                        }
                    }
                }).end(appearance.data);
            }
        }
        else {
            cloudinary.v2.uploader.upload_stream({ folder: "Tantan", resource_type: 'auto' }, async (error, result) => {
                if (error) {
                    console.log(error);
                    return next(new ErrorHandler('Some error occurred!', '500'));
                } else {
                    var newuser = await User.find({ "appearances.eTag": { $in: [result.etag] } });
                    if (newuser.length == 0) {
                        user = await User.findByIdAndUpdate(user._id, { $push: { appearances: { eTag: result.etag, publicId: result.public_id, resultUrl: result.secure_url } } },
                            { new: true });
                    }
                }
            }).end(userAppearances.data);
        }
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({
        success: true,
        user,
        admin
    });
});

const banUser = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, phoneNumber_user
    var { phoneNumber, phoneNumber_user } = req.body;
    var admin = await Admin.findOne({ phoneNumber });
    if (!admin) {
        return res.status(401).json({
            success: false,
            "error message": "admin not logged in yet"
        })
    }
    var user = await User.deleteOne({ phoneNumber: phoneNumber_user });
    res.status(200).json({
        success: true,
        user
    });
});

const verifyUser = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, phoneNumber_user
    var { phoneNumber, phoneNumber_user } = req.body;
    var admin = await Admin.findOne({ phoneNumber });
    if (!admin) {
        return res.status(401).json({
            success: false,
            "error message": "admin not logged in yet"
        });
    }
    var user = await User.findOne({ phoneNumber: phoneNumber_user });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        })
    }
    var user = await User.findByIdAndUpdate(user._id, { verified: true }, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

module.exports = { login, getUserRegistration, editUserProfile, banUser, verifyUser };