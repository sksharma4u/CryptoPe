const express = require('express');
const { getAllProducts, createProduct } = require('../controllers/productController');

const router = express.Router();

router.route("/products").get(getAllProducts)

//This is my post request 
router.route("/product/new").post(createProduct)

module.exports = router;