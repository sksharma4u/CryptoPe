// SO hee I create a Token And Saving into cookies

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //option for cookie


    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Here I convert dat into milli second
        ),
        httpOnly: true
    };

    res.status(statusCode).cookie('token', token, options).json({
        succes: true,
        user,
        token
    });
};

module.exports = sendToken;