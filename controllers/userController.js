const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ErrorHandler = require("../utils/errorHandler.js");
const User = require('../models/userModel.js');
const sendCookie = require('../utils/sendCookie.js');
const cloudinary = require('cloudinary');

const login = catchAsyncErrors(async (req, res, next) => {
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (user) {
        res.status(401).json({
            success: false,
            "error message": "Another account with same phone number already exists"
        });
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    user = await User.create({ phoneNumber, likes: 0 });
    sendCookie(user, 201, res);
});

const profileOverview = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, name, gender, age, location
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
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
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler("User has not logged in yet", '401'));
    }
    var userAppearances = req.files.appearances;
    console.log(Array.isArray(userAppearances));
    if (Array.isArray(userAppearances) == false) {
        cloudinary.v2.uploader.upload_stream({ folder: "Tantan", resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.log(error);
                return next(new ErrorHandler('Some error occurred!', '500'));
            } else {
                var newuser = await User.find({ "_id": user._id, "appearances.eTag": { $in: [result.etag] } });
                if (newuser.length == 0) {
                    user = await User.findByIdAndUpdate(user._id, { $push: { appearances: { eTag: result.etag, publicId: result.public_id, resultUrl: result.secure_url } } },
                        { new: true });
                }
            }
        }).end(userAppearances.data);
    }
    else {
        for (var i = 0; i < userAppearances.length; i++) {
            cloudinary.v2.uploader.upload_stream({ folder: "Tantan", resource_type: 'auto' }, async (error, result) => {
                if (error) {
                    console.log(error);
                    return next(new ErrorHandler('Some error occurred!', '500'));
                } else {
                    var newuser = await User.find({ "_id": user._id, "appearances.eTag": { $in: [result.etag] } });
                    if (newuser.length == 0) {
                        user = await User.findByIdAndUpdate(user._id, { $push: { appearances: { eTag: result.etag, publicId: result.public_id, resultUrl: result.secure_url } } },
                            { new: true });
                    }
                }
            }).end(userAppearances[i].data);
        }
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
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler('User not logged in', '401'));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true })
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
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler("User not logged in", '401'));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
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
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler('user not logged in', '401'));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
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
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler('user not logged in', '401'));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
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
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler('user not logged in', '401'));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
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
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
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
    // phoneNumber, phoneNumberOfDate, obtainedDate, location
    var { phoneNumber, phoneNumberOfDate, obtainedDate, location } = req.body;
    var user = await User.findOne({ phoneNumber });
    var userToDate = await User.findOne({ phoneNumber: phoneNumberOfDate });
    if (!user) {
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler("User not logged in", '401'));
    }
    if (!userToDate) {
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler("User to date not logged in", '401'));
    }
    user = await User.findByIdAndUpdate(user._id, { $push: { dates: { user_id: userToDate._id, name: userToDate.name, date: obtainedDate, location } } }, { new: true });
    var nuser = await User.findByIdAndUpdate(userToDate._id, { $push: { dates: { user_id: user._id, name: user.name, date: obtainedDate, location } } }, { new: true });
    res.status(200).json({
        success: true,
        user,
        nuser
    });
})

const getAllDates = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var user = await User.findOne({ phoneNumber: req.query.phoneNumber });
    if (!user) {
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler("User not logged in", '401'));
    }
    var allDates = [];
    if (user.dates) {
        allDates = user.dates;
    }
    res.status(200).json({
        success: true,
        allDates
    })
});

const addLike = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, liked_user_id
    var { phoneNumber, liked_user_id } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
    }
    var liked_user = await User.findOne({ _id: liked_user_id });
    if (user.id == liked_user.id) {
        return res.status(500).json({
            success: false,
            "error message": "you cannot like your own profile"
        });
    }
    var already_liked = await User.findOne({ _id: liked_user_id, whoLikedYou: { $in: [user._id] } });
    if (already_liked) {
        return res.status(500).json({
            success: false,
            "error message": "already liked by same user"
        });
    }
    var userLikes = liked_user.noOfLikes;
    if (liked_user.noOfLikes)
        userLikes = userLikes + 1;
    else
        userLikes = 1;
    liked_user = await User.findByIdAndUpdate(liked_user._id, { noOfLikes: userLikes, $push: { "whoLikedYou": user._id } }, { new: true });
    res.status(200).json({
        success: true,
        liked_user
    })
});

const getLikes = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var user = await User.findOne({ phoneNumber: req.query.phoneNumber });
    if (!user) {
        res.status(401).json({
            success: false,
            "error message": "User has not logged in yet"
        });
        return next(new ErrorHandler("User not logged in", "401"));
    }
    if (user.membership != 'VIP') {
        return res.status(500).json({
            success: false,
            "error message": "you need to upgrade your membership to access this feature"
        });
    }
    var noOfLikes = 0;
    if (user.noOfLikes) {
        noOfLikes = user.noOfLikes;
    }
    res.status(200).json({
        success: true,
        noOfLikes,
        "who liked you": user.whoLikedYou
    });
});

const setAvailableTime = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, startTime, endTime, repeat, proposal
    var { phoneNumber, startTime, endTime, repeat, proposal } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    user = await User.findByIdAndUpdate(user._id, { availableTime: { startTime, endTime, repeat, proposal } }, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const askToDate = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, user_id_to_date
    var { phoneNumber, user_id_to_date } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    var nuser = await User.findOne({ _id: user_id_to_date });
    user = await User.findByIdAndUpdate(user._id, { $push: { "askToDate": { user_id: nuser._id, name: nuser.name } } }, { new: true });
    nuser = await User.findByIdAndUpdate(nuser._id, { $push: { "askedToDate": { user_id: user._id, name: user.name } } }, { new: true });
    res.status(200).json({
        success: true,
        user,
        nuser
    });
});

const addDateReview = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, date_id, experienceRating, whatDidYouLike, comment
    var { phoneNumber, date_id, experienceRating, whatDidYouLike, comment } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    console.log(phoneNumber, date_id, experienceRating, whatDidYouLike, comment);
    var user = await User.findOneAndUpdate({ _id: user._id, "dates._id": date_id }, { "dates.$.reviews": { experienceRating, whatDidYouLike, comment } }, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const getPastDates = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber 
    var phoneNumber = req.query.phoneNumber;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    var pastDates = [];
    for (var dates of user.dates) {
        if (dates.date < Date.now()) {
            pastDates.push(dates);
        }
    }
    res.status(200).json({
        success: true,
        pastDates
    });
});

const earnGems = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, noOfGems
    var { phoneNumber, noOfGems } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    var alreadyPresentGems = user.gems;
    user = await User.findByIdAndUpdate(user._id, { gems: Number(alreadyPresentGems) + Number(noOfGems) }, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const spendGems = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, noOfGems
    var { phoneNumber, noOfGems } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    var alreadyPresentGems = user.gems;
    if (Number(alreadyPresentGems) - Number(noOfGems) < 0) {
        return res.status(500).json({
            success: false,
            "error message": "not enough gems left to be spent upon"
        });
    }
    user = await User.findByIdAndUpdate(user._id, { gems: Number(alreadyPresentGems) - Number(noOfGems) }, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const purchaseMembershipsByGems = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    user = await User.findByIdAndUpdate(user._id, { membership: "VIP" }, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const getPotentialDates = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var phoneNumber = req.query.phoneNumber;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    var averageTimeUser = (Number(user.availableTime.startTime) + Number(user.availableTime.endTime)) / 2;
    var allUsers = await User.find({});
    var potentialDates = [];
    for (var presentUser of allUsers) {
        if ((presentUser.id != user._id) && (presentUser.availableTime)) {
            var averageTimePresentUser = (Number(presentUser.availableTime.startTime) + Number(presentUser.availableTime.endTime)) / 2;
            potentialDates.push({ absDiff: Number(averageTimePresentUser - averageTimeUser) / 2, presentUser });
        }
    }
    function comp(a, b) {
        return a.absDiff - b.absDiff;
    }
    potentialDates.sort(comp);
    res.status(200).json({
        success: true,
        potentialDates
    });
});

const readFeedback = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, phoneNumberOfDate
    var { phoneNumber, phoneNumberOfDate } = req.query;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(401).json({
            success: false,
            "error message": "user not logged in yet"
        });
    }
    var dateUser = await User.findOne({ phoneNumber: phoneNumberOfDate });
    if (!dateUser) {
        return res.status(401).json({
            success: false,
            "error message": "date user not logged in"
        });
    }
    if (user.membership != 'VIP') {
        return res.status(500).json({
            success: false,
            "error message": "you need to upgrade your membership to access this feature"
        });
    }
    var reviews = [];
    for (var date of dateUser.dates) {
        if (toString(date.user_id) == toString(user._id)) {
            reviews.push(date.reviews);
        }
    }
    return res.status(200).json({
        success: false,
        reviews
    });
});

module.exports = { login, profileOverview, appearances, aboutMe, datingPreferences, personalInfo, locationServices, likeToDate, editProfile, addDate, getAllDates, addLike, getLikes, setAvailableTime, askToDate, addDateReview, getPastDates, earnGems, spendGems, purchaseMembershipsByGems, getPotentialDates, readFeedback };