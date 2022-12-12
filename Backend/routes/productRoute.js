const express = require('express');

const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteReview,
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { route } = require('./userRoute');

const router = express.Router();

// Get Request
router.route("/products").get(getAllProducts)

//This is my post request 
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

//This is my Put Request to update it
router.route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    .get(getProductDetails)

router.route("/product/:id").get(getProductDetails);


router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview)

module.exports = router;