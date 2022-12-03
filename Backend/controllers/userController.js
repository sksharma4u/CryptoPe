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