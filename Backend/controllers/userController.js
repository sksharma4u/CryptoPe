const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto")

//Register a User

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is a Sample Id",
            url: "Profile picture ka URL",
        },

    });
    sendToken(user, 201, res);
});


// LOGIN USER

exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    const { email, password } = req.body;

    //checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);

})


// LOGOUT USER

exports.logout = catchAsyncErrors(async(req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out",
    });
})

//FORGOT PASSWORD

exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your Password Reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email than, please ignore it`;
    try {

        await sendEmail({
            email: user.email,
            subject: `Food Ordering password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`,
        })
    } catch (error) {

        // If any error Come that we have to do underfined the token and expire token that will be saved into the database
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})

//RESET PASSWORD
exports.resetPassword = catchAsyncErrors(async(req, res, next) => {

    //Creating Token Hash

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token) //Here I get Acces the tolen that can be send through mail
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken, // Now I can Match the token with the token that pesent in the database
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has been expired", 404));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler(" Password does not match", 400));
    }

    user.password = req.body.password; // Here I set the new password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})


//Get User Details

exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
})

// UPDATE USER PASSWORD

exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }


    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);

});


//Update User Profile

exports.updateProfile = catchAsyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    //We will add cloudinary later (Avatar)

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true
    });

})

//Get all users

exports.getAllUser = catchAsyncErrors(async(req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })
})

//Get single user (Admin)

exports.getSingleUser = catchAsyncErrors(async(req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`user does not exist with Id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user,
    })
})

//Update User Role -- Admin

exports.updateUserRole = catchAsyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };



    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true
    });

})

//Delete User Profile  --Admin

exports.deleteUser = catchAsyncErrors(async(req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`user does not exist wth Id : ${req.params.id}`))
    }

    await user.remove();;

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });

})