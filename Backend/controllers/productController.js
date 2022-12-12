const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


//create Product --- This is only for ADMIN
exports.createProduct = catchAsyncErrors(async(req, res, next) => {


    req.body.user = req.user.id;
    const product = await Product.create(req.body); //Here I will create a request
    res.status(201).json({
        success: true,
        product
    })
});

//Get All Product
exports.getAllProducts = catchAsyncErrors(async(req, res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount,
    })
});

//Get product Details
exports.getProductDetails = catchAsyncErrors(async(req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
        //productCount,

    })
});

//Update Product -- Only Admin

exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product,

    })
});

//Delete Product

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product Deleted succesfully"
    })

});

//Create New Review or Update the review

exports.createProductReview = catchAsyncErrors(async(req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };


    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating),
                (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    //  Here we calculated the average of reviews

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    })

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })

});

//Get all Reviews of a Product

exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

//Delete Reviews

exports.deleteReview = catchAsyncErrors(async(req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }


    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());


    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidator: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,

    });
});