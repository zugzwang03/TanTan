const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ErrorHandler = require("../utils/errorHandler.js");
const User = require('../models/userModel.js');
const sendCookie = require('../utils/sendCookie.js');
const cloudinary = require('cloudinary');

const login = catchAsyncErrors(async (req, res, next) => {
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (user) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    user = await User.create({ phoneNumber });
    sendCookie(user, 201, res);
});

const profileOverview = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, name, gender, age, location
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User has not logged in yet", '401'));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({
        success: true,
        user
    })
});

const appearances = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, appearances
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User has not logged in yet", '401'));
    }
    var userAppearances = req.files.appearances;
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
    res.status(200).json({
        success: true,
        user
    })
});

const aboutMe = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, bio, occupation, interestsAndHobbies, lifeStyle
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler('User not logged in', '401'));
    }
    await User.findByIdAndUpdate(user._id, req.body, { new: true })
    res.status(200).json({
        success: true,
        user
    });
});

const datingPreferences = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, relationshipGoals, dealBreakersAndPreferences
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User not logged in", '401'));
    }
    await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const personalInfo = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, height, bodyType, religion, politicalViews
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler('user not logged in', '401'));
    }
    await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const locationServices = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, location
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler('user not logged in', '401'));
    }
    await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const likeToDate = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, likeToDate
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler('user not logged in', '401'));
    }
    await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const editProfile = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, name, gender, age, location, appearances, bio, occupation, education, interestAndHobbies, MusicAndEntertainment, Lifestyle, LanguagesSpoken, relationshipGoals, dealBreakerAndPreferences, height, bodyType, religionAndBeliefs, politicalViews, pets
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler('user not logged in', '401'));
    }
    console.log(req.files);
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
        user
    });
});

const addDate = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, phoneNumberOfDate
    var { phoneNumber, phoneNumberOfDate, obtainedDate } = req.body;
    var user = await User.find({ phoneNumber });
    var userToDate = await User.find({ phoneNumber: phoneNumberOfDate });
    if (!user) {
        return next(new ErrorHandler("User not logged in", '401'));
    }
    if (!userToDate) {
        return next(new ErrorHandler("User to date not logged in", '401'));
    }
    user = await User.findByIdAndUpdate(user[0]._id, { $push: { dates: { user_id: userToDate[0]._id, name: userToDate[0].name, date: obtainedDate } } }, {new: true});
    res.status(200).json({
        success: true,
        user
    });
})

const getAllDates = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var user = await User.find({ phoneNumber: req.query.phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User not logged in", '401'));
    }
    var allDates = user[0].dates;
    res.status(200).json({
        success: true,
        allDates
    })
});

module.exports = { login, profileOverview, appearances, aboutMe, datingPreferences, personalInfo, locationServices, likeToDate, editProfile, addDate, getAllDates };
