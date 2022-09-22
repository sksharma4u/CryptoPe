const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, { //Here Process.env.DB_URI so basically  DB_URI is an variable which stores the database connection link which stores in env file
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then((data) => {
    console.log(`MOngodb connected with server : ${data.connection.host}`);
}).catch((err) => {
    console.log(err);
})