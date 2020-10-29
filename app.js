const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


//require routes
const listRoutes = require(__dirname+"/routes/list.js");
const itemRoutes = require(__dirname+"/routes/item.js");
const authRoutes = require(__dirname+"/routes/auth.js");



app.use(session({
    
  secret:"my secret stuff",
  resave: false,
  saveUninitialized:false,
  cookie:{ maxAge: 1000* 60 * 60 *24 * 365}

}));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

//this model is needed because of line B1, B2, B3, for creating the type of strategy
const User = require(__dirname+"/models/userModel.js").User;

passport.use(User.createStrategy());//B1
passport.serializeUser(User.serializeUser());//B2
passport.deserializeUser(User.deserializeUser());//B3


//use desired routes, NOTE this is middleware
app.use("/list",listRoutes);
app.use("/item",itemRoutes);
app.use("/",authRoutes);

//Db connection code

mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify: false});
mongoose.set("useCreateIndex",true);



// home page route
app.get("/",(req,res)=>{
    res.redirect("/login");
});
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
