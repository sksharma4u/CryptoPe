const express = require('express');

const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');

const router = express.Router();

// Get Request
router.route("/products").get(getAllProducts)

//This is my post request 
router.route("/product/new").post(createProduct)

//This is my Put Request to update it
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails)


module.exports = router;