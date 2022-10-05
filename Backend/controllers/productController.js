const Product = require("../models/productModel");

//create Product --- This is only for ADMIN
exports.createProduct = async(req, res, next) => {
    const product = await Product.create(req.body); //Here I willcreate a request
    res.status(201).json({
        success: true,
        product
    })
}

//Get All Product
exports.getAllProducts = async(req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
}

//Get product Details
exports.getProductDetails = async(req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    res.status(200).json({
        success: true,
        product
    })
}

//Updat Product -- Only Admin

exports.updateProduct = async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
}

//Delete Product

exports.deleteProduct = async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product Deleted succesfully"
    })

}