const mongoose = require("mongoose");

const itemsSchema = {
    name: String,
    orderNumber:Number
};

const Item = mongoose.model("Item", itemsSchema);
 

module.exports = {
    itemsSchema,
    Item
};

