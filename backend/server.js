// require = import
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = 4000 || process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_URI;

var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var foodItemRouter = require("./routes/food");


// meta JS tasks
// cors -> Cross origin resource sharing 
//          - queries from browser
//          - API request (resource) from browser to local
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true })
        .then(() => console.log("MongoDB database connection established successfully !"))
        .catch((err) => console.log(err));

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/food", foodItemRouter);


// checks if the server is established the specified PORT number
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
