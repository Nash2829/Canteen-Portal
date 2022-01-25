var express = require("express");
const food = require("../models/food");
var Router = express.Router();
// Load User model
const foodImport = require("../models/food");
const TAGS = new Map(foodImport.TAGS.map((tag, index) => [tag, index]));
const ADD_ONS = new Map(foodImport.ADD_ONS.map((addOn, index) => [addOn, (index >>> 0)]));
const foodItem = foodImport.foodItem;

// get 
Router.get("/", function(req, res) {
    User.find(function(err, foodItems) {
		if (err) {
			console.log(err);
		} else {
			res.json(foodItems);
		}
	})
});

// Add or insert food item 
Router.post("/insert", async (req, res) => {
    let FoodItem = req.body;

    const existingFoodItem = await foodItem.findOne({ Name: FoodItem.Name, VendorID: FoodItem.VendorID });
    if (existingFoodItem) {
        res.status(400).json({errMsg: "You already have a food item by this name in your menu."});
    } else {
        let tagSet = 0 >>> 0;
        FoodItem.Tags.forEach((tag) => tagSet |= (1 << (TAGS.get(tag))));
        const newFoodItem = new foodItem ({
            Name: FoodItem.Name,
            Price: FoodItem.Price,
            Rating: 0,
            Veg: FoodItem.Veg,
            AddOns: FoodItems.AddOns.map((addOn) => { ADD_ONS.get(addOn.Name), addOn.Price }),
            Tags: NumberInt(tagSet),
            VendorID: FoodItem.VendorID
        });
        newFoodItem
            .save()
            .then(foodItem => res.status(200).json(foodItem))
            .catch(err => res.status(500).json({errMsg: err.message}));
    }
});


module.exports = Router;

