var express = require("express");
const food = require("../models/food");
var Router = express.Router();
// Load User model
const foodImport = require("../models/food");
// const TAGS = new Map(foodImport.TAGS.map((tag, index) => [tag, index]));
// const ADD_ONS = new Map(foodImport.ADD_ONS.map((addOn, index) => [addOn, (index >>> 0)]));
const foodItem = foodImport.foodItem;

Router.get("/", function(req, res) {
    // console.log("Vendor ID: ", req.body);
    foodItem.find(function(err, users) {
		if (err) {
			console.log(err);
            res.status(500).json({errMsg: err.message});
		} else {
            console.log(users);
			res.status(200).json(users);
		}
	});
});

// Add or insert food item 
Router.post("/insert-item", async (req, res) => {
    const FoodItem = req.body;

    const existingFoodItem = await foodItem.findOne({ Name: FoodItem.Name, VendorID: FoodItem.VendorID });
    if (existingFoodItem) {
        res.status(400).json({errMsg: "You already have a food item by this name in your menu."});
    } else {
        let tagSet = 0 >>> 0;
        // FoodItem.Tags.forEach((tag) => tagSet |= (1 << (TAGS.get(tag))));
        const newFoodItem = new foodItem(FoodItem);
        newFoodItem
            .save()
            .then(foodItem => res.status(200).json(foodItem))
            .catch(err => res.status(500).json({errMsg: err.message}));
    }
});

// Edit 
Router.post('/edit-item', async (req, res) => {
    console.log(req.body);
    const FoodItem = req.body;
    foodItem.findOneAndUpdate({ Name: FoodItem.Name, VendorID: FoodItem.VendorID },
        FoodItem, 
        {new: true},
        (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({errMsg: err.message});
            } else {
                console.log("FOOD ITEM: ", doc); 
                res.json(doc);
            }
        }
    );
});

// Delete
Router.post('/delete', async (req, res) => {
    const ID = req.body._id;
    foodItem.deleteOne({_id: ID}).then(() => {
        console.log('Deleted: ', ID);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({errMsg: error.message});
    })
});

module.exports = Router;

