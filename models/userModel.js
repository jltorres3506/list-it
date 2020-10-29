const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
 
    userTag: String,
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    passcode: {type:String, required:true}
   
    //Note: given no data this process auto creates username and password
});

//NOTE: these options are for validation of password and username
//its through passport-local-mongoose
const options = {
    errorMessages:{
        MissingPasswordError: "You dumb Nut A password is needed",
        MissingUsernameError: 'No username was given',
    }
}

//adds passportLocalMongoose plugin to schema
//makes buidling username and password with passport alot easier( less code)
UserSchema.plugin(passportLocalMongoose, options);

//make schema into a model and export it so it can be used in other files
exports.User = mongoose.model("User", UserSchema);