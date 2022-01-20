// require = import
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000 || process.env.PORT;
const atlasUser = 'admin';
const pass = 'admin';
const dbname = 'test';
const DB = 'mongodb+srv://' + atlasUser + ':' + pass + '@cluster0.2rqen.mongodb.net/' + dbname + '?retryWrites=true&w=majority'

// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
// var foodItemRouter = require("./routes/food");


// meta JS tasks
// cors -> Cross origin resource sharing 
//          - queries from browser
//          - API request (resource) from browser to local
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true })
        .then(() => console.log("MongoDB database connection established successfully !"))
        .catch((err) => console.log(err));

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
// app.use("/vendor", vendor);


// checks if the server is established the specified PORT number
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
