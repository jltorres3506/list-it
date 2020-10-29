const mongoose = require("mongoose");
 const itemModel = require(__dirname+"/itemModel.js");


 const listSchema = {
    name:String,
    items:[itemModel.itemsSchema],
    userTagId: String //used to link user with right list
 };
 
exports.List = mongoose.model("List",listSchema);