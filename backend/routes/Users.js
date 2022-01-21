var express = require("express");
var Router = express.Router();
// Load User model
const User = require("../models/Users");

// GET request 
// Getting all the users
Router.get("/", function(req, res) {
    User.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	})
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them


// POST request 
// Add a user to db
Router.post("/register", async (req, res) => {
    const registerData = req.body
    if (registerData.userStatus === 'Vendor') {
        const newUser = new User({
            Name: registerData.Name,
            Email: registerData.Email,
            date: registerData.date,
            Password: registerData.Password,
            ContactNo: registerData.ContactNo,
            userStatus: registerData.userStatus,
            ShopName: registerData.ShopName,
            OpeningTime: registerData.OpeningTime,
            ClosingTime: registerData.ClosingTime
        });
        // await
        newUser
            .save()
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(400).send(err);
            });
    } else {
        const newUser = new User({
            Name: registerData.Name,
            Email: registerData.Email,
            date: registerData.date,
            Password: registerData.Password,
            ContactNo: registerData.ContactNo,
            userStatus: registerData.userStatus,
            // ShopName: 'JC',
            Age: registerData.Age,
            BatchName: registerData.BatchName
        });
        // await
        newUser.save()
            .then(user => {
                res.status(200).json(newUser);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }
});

// POST request 
// Login
Router.post("/login", (req, res) => {
	const Email = req.body.Email;
    const Password = req.body.Password;

    let respo = {
        code: 0,
        user: null,
        type: ''
    };
	// Find user by email
    User.findOne({ Email })
    .then((users) => {
        if (!users) {
            res.json(respo);
        } else {
            if (users.Password === Password) {
                respo.code = 1;
                respo.user = users;
                respo.type = users.userStatus;
                res.json(respo);
            } else {
                respo.code = 2;
                res.json(respo);
            }
        }
    });          
});


// EDIT profile
Router.post('/edit', async (req, res) => {
    const user = req.body;
    console.log('UserType: ', user.userStatus);
    console.log(user);
    if (user.userStatus === 'Buyer') {
        await User.findOneAndUpdate({_id: user._id}, {
            $set: {
                Name: user.Name,
                Password: user.Password,
                ContactNo: user.ContactNo,
                Age: user.Age,
                BatchName: user.BatchName
            }
        }, {new: true, upsert: true}, 
            (err, doc)=>{
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc); 
                    res.json(doc);
                }
            });
    } else {
        await User.findOneAndUpdate({_id: user._id}, {
            $set: {
                Name: user.Name,
                Password: user.Password,
                ContactNo: user.ContactNo,
                ShopName: user.ShopName,
                OpeningTime: user.OpeningTime,
                ClosingTime: user.ClosingTime
            }
        }, {new: true, upsert: true}, 
        (err, doc)=>{
            if (err) {
                console.log(err);
            } else {
                console.log(doc); 
                res.json(doc);
            }
        });
    }
});

module.exports = Router;

