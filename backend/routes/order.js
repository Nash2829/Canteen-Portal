var express = require("express");
var Router = express.Router();
// Load User model
// const TAGS = new Map(foodImport.TAGS.map((tag, index) => [tag, index]));
// const ADD_ONS = new Map(foodImport.ADD_ONS.map((addOn, index) => [addOn, (index >>> 0)]));
const order = require('../models/order');

Router.get("/", async function(req, res) {
    // console.log("Vendor ID: ", req.body);
    const VendorID = req.query.vendorid;
    const BuyerID = req.query.buyerid;
    if (VendorID !== null && VendorID !== undefined) {
        order.find({VendorID: VendorID})
            .then((orders) => res.status(200).json(orders))
            .catch(err => console.log(err));
    } else if (BuyerID !== null && BuyerID !== undefined) {
        order.find({BuyerID: BuyerID})
            .then((orders) => res.status(200).json(orders))
            .catch(err => console.log(err));
    } else {
        order.find(function(err, orders) {
            if (err) {
                console.log(err);
                res.status(500).json({errMsg: err.message});
            } else {
                res.status(200).json(orders);
            }
        });
    }
});

// Add or insert food item 
Router.post("/place", async (req, res) => {
    const Order = req.body;
    console.log(Order);
    const newOrder = new order({
        foodItem: Order.foodItem,
        VendorID: Order.VendorID,
        BuyerID: Order.BuyerID,
        Price: Order.Price,
        Quantity: Order.Quantity,
        AddOns: Order.AddOns,
        Veg: Order.Veg,
        Total: Order.Total,
        Rating: Order.Rating,
        Status: Order.Status 
    });
    newOrder
        .save()
        .then(order => {
            console.log(order);
            res.status(200).json(order);
        })
        .catch(err => {console.log("Logged: ", err); res.status(500).json(err); });
});

// Edit (change Status)
Router.post('/status', async (req, res) => {
    const Order = req.body;
    console.log(Order.Status);
    await order.findOneAndUpdate({ _id: Order._id },
        {Status: Order.Status}, 
        {new: true},
        (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                console.log("FOOD ITEM: ", doc); 
                res.json(doc);
            }
        }
    );
});


module.exports = Router;

