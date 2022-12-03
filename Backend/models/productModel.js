const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    //Now Here is product Schema 
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true
    },
    description: {
        type: String,
        require: [true, "Please Enter product description "]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [8, "Price Cannot Exceed a charcter"]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        }
    }],
    category: {
        type: String,
        requires: [true, "Please Enter product Category"],
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock Cannot exceed 4 charcter"],
        default: 1,

    },
    numOfReviews: {
        type: Number,
        defauult: 0
    },
    reviews: [{
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true
        }
    }],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }



})
module.exports = mongoose.model("Product", productSchema);