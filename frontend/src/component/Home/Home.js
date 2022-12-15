import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css"
import Product from "./Product.js"
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";

// const product = {
//     name: "Momo",
//     images: [{ url: "https://img.freepik.com/free-photo/high-angle-japanese-dumplings-composition_23-2148809869.jpg?size=626&ext=jpg&ga=GA1.2.1190347391.1660648808" }],
//     price: "₹60",
//     _id: "abhishek",
// };

const Home = () => {
    const dispatch = useDispatch();
    const { loading, error, products, productsCount } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);
    return (

        <Fragment>
            <MetaData title="CryptoPay" />
            <div className="banner">
                <p>Welcome to CryptoPay</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
                <a href="#container">
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>
            <h2 className="homeHeading">Featured Products</h2>
            <div className="container" id="container">
                {/* <Product product={product} /> */}
                {products && products.map((product) => <Product product={product} />)}
            </div>
        </Fragment>
    );
};
export default Home;