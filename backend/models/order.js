const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const orderSchema = new Schema({
    foodItem: {type: String},
    VendorID: {type: Schema.Types.ObjectId},
    BuyerID: {type: Schema.Types.ObjectId},
    Price: {type: Number},
    Quantity: {type: Number},
    AddOns: {type: String},
    Veg: {type: Boolean},
    Total: {type: Number},
    Rating: {type: Number},
    date: {type: Number, default: Date.now()},
    Status: {type: String}
}); 

module.exports = order = mongoose.model("orderSchema", orderSchema);

