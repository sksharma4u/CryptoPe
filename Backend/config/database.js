const mongoose = require("mongoose");


const connectDatabase = async() => {
    try {
        mongoose.connect(process.env.DB_URI, { //Here Process.env.DB_URI so basically  DB_URI is an variable which stores the database connection link which stores in env file
        }).then((data) => {
            console.log(`MOngodb connected with server : ${data.connection.host}`);
        })
    } catch (err) {
        console.log(err);
    }

}

module.exports = connectDatabase;