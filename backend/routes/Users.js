const express = require("express");
const Router = express.Router();
// Load User model
const User = require("../models/Users");
const bcrypt = require("bcrypt");
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
    const registerData = req.body;
    await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({ Email: registerData.Email});
    if (existingUser)
        return res.status(400).json({errMsg: "Account with this email already exists"});
    
    const salt = await bcrypt.genSalt();
    const Password = await bcrypt.hash(registerData.Password, salt);

    if (registerData.userStatus === 'Vendor') {
        const newUser = new User({
            Name: registerData.Name,
            Email: registerData.Email,
            date: registerData.date,
            Password: Password,
            ContactNo: registerData.ContactNo,
            userStatus: registerData.userStatus,
            ShopName: registerData.ShopName,
            OpeningTime: registerData.OpeningTime,
            ClosingTime: registerData.ClosingTime
        });
        newUser
            .save()
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(500).json({errMsg: err.message});
            });
    } else {
        const newUser = new User({
            Name: registerData.Name,
            Email: registerData.Email,
            date: registerData.date,
            Password: Password,
            ContactNo: registerData.ContactNo,
            userStatus: registerData.userStatus,
            Age: registerData.Age,
            BatchName: registerData.BatchName
        });
        newUser.save()
            .then(user => {
                res.status(200).json(newUser);
            })
            .catch(err => {
                res.status(500).json({errMsg: err.message});
            });
    }
});

// POST request 
// Login
Router.post("/login", async (req, res) => {
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
            const passwordMatch = await bcrypt.compare(Password, users.Passworsd);
            if (passwordMatch) {
                respo.code = 1;
                respo.user = users;
                respo.type = users.userStatus;
                res.json(respo);
            } else {
                respo.code = 2;
                res.json(respo);
            }
        }
    })
    .catch (err => res.status(500).json({errMsg: err.message}));
});


// EDIT profile
Router.post('/edit', async (req, res) => {
    if (req.body.changePassword) {
        const salt = await bcrypt.genSalt();
        const Password = await bcrypt.hash(req.body.newPassword, salt);
        const userId = req.body._id;
        await User.findOneAndUpdate({_id: userId}, {
            $set: {Password: Password}
        }, {new: true}, 
            (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({errMsg: err.message});
                } else {
                    console.log(doc); 
                    res.json(doc);
                }
            });
    } else {
        const user = req.body.user;
        console.log('UserType: ', user.userStatus);
        console.log(user);
        if (user.userStatus === 'Buyer') {
            await User.findOneAndUpdate({_id: user._id}, {
                $set: {
                    Name: user.Name,
                    Email: user.Email,
                    ContactNo: user.ContactNo,
                    Age: user.Age,
                    BatchName: user.BatchName
                }
            }, {new: true}, 
                (err, doc)=>{
                    if (err) {
                        console.log(err);
                        res.status(500).json({errMsg: err.message});
                    } else {
                        console.log(doc); 
                        res.json(doc);
                    }
                });
        } else {
            await User.findOneAndUpdate({_id: user._id}, {
                $set: {
                    Name: user.Name,
                    Email: user.Email,
                    ContactNo: user.ContactNo,
                    ShopName: user.ShopName,
                    OpeningTime: user.OpeningTime,
                    ClosingTime: user.ClosingTime
                }
            }, {new: true}, 
            (err, doc)=>{
                if (err) {
                    console.log(err);
                    res.status(500).json({errMsg: err.message});
                } else {
                    console.log(doc); 
                    res.json(doc);
                }
            });
        }
    }
});

module.exports = Router;

