const express = require('express');
const passport = require("passport");
const router = express.Router();
const check = require(__dirname +"/../helpers/checkFunctions.js");
const User = require(__dirname+"/../models/userModel.js").User;

const cryptoRandomString = require('crypto-random-string');

const yup = require('yup');
const _ = require('lodash');



router.get("/register",(req,res)=>{
     res.render("register", {"message":req.flash("message")});
});



router.post("/register",(req,res,next)=>{
   
    const schema = yup.object()
        .shape({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            passcode: yup.string().required(),
            password: yup.string().required().min(7),
            username: yup.string().required().min(10,"Email must be at least 5 characters").email('Please enter a valid email address'),
  });
  
  //validate data from form
  schema.validate(req.body)
    .then((data)=>{
        
        // check to see if username already exists in db
        User.findOne({username:data.username},(error,foundOne)=>{
            if(error){
                console.log("error");
            }
            if(foundOne){
                        req.flash("message" , "There is already an account using that email address!");
                        res.redirect("/register");

            //if no account is found do this            
            }else{
                // create unique userTag for that user, this will be used to identify lists that current user makes
                const userTag = req.body.lastName+cryptoRandomString({length: 10});//combination lastName and randomString
       
                    // creating a new document based on the user model and make lowercase certian fields
                    let newUser = new User({
                        username:  req.body.username.toLowerCase(),
                        userTag:   userTag.toLowerCase(),
                        firstName: req.body.firstName.toLowerCase(),
                        lastName:  req.body.lastName.toLowerCase(),
                        passcode: req.body.passcode 
                    });

                    // register user
                    User.register(newUser, req.body.password, (err, user)=>{
                        if(err){
                                    req.flash("message" , "All input fields must be filled out!");
                                    res.redirect("/register");
                                }else{
                                    console.log("your registered!");
                                    
                                    req.flash("successMessage" , "You have been registered!");
                                    res.redirect("/login");
                                }
                    });
            }
        });
        
    })//end of then block

            //catch block used for catching validation errors
            .catch((e)=>{
            
                                
                const userData = req.body;

                //add the error message as new proeprty to data that is
                //going to appear in the view
                userData["message"]=e.errors;
                res.render("register",userData);
                            
            });

    //middleware code
});




 

router.get("/login",(req,res)=>{
    res.render("login", {
        message: req.flash("errorMessage"),
        successMessage:req.flash("successMessage")
    
    });
});







router.post("/login",(req,res, next)=>{
        //grab all input data  
        const {username, password} = req.body;

        //check to see if any 2 fields are empty
        if(!username || !password){
            req.flash("errorMessage", "All input fields must be filled out correctly!");
            res.redirect("/login");
        }else{
            next();//run the next middleware 
        }   
        },
        //middleware used to check if creds are good
        passport.authenticate("local",{
            successRedirect: "/list/show",
            failureRedirect:"/wrongCreds"
        
        }));

    // used if wrong creds are entered in login screen
    router.get("/wrongCreds",(req,res)=>{

        //define the flash message that is in the res.locals
        req.flash("errorMessage","You have the wrong username or password");
        res.redirect("/login");   
     });
    


router.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/");
});

router.get("/passcode",(req,res)=>{
   
    if(req.isAuthenticated()){
        res.render("passcode",{"errorMessage": req.flash("errorMessage")});
    }else{
        res.redirect("/");
    }
    
});

router.post("/passcode",(req,res)=>{

    if(!check.isInputEmpty(req.body.passcode)){
        req.user.passcode = req.body.passcode;
        req.user.save();
        res.redirect("list/show");
    }else{
        req.flash("errorMessage","Passcode cannot be left empty!");
        res.redirect("/passcode");
    }
    
});

router.get("/passwordReset",(req,res)=>{
   
    res.render("passwordResetConfirmation",{"errorMsg":req.flash("errorMessage")});
});

router.post("/passwordReset",(req,res)=>{
    const fName= req.body.firstName;
    const lName= req.body.lastName;
    const username = req.body.username;
    const passcode = req.body.passcode;
    const newPassword = req.body.newPassword;

    const condition ={
            firstName:fName,
            lastName:lName,
            username:username,
            passcode:passcode
        };


    User.findOne(condition,(err, foundUser)=>{
        if(err){
            console.log("error at one of the conditions of findOne()");
        }else{
            if(!Array.isArray(foundUser) && !check.isObjectEmpty(foundUser)){
                
                foundUser.setPassword(newPassword,()=>{
                    foundUser.save(err);
                    if(err){
                        console.log("error after set password is called");
                    }
                    
                    res.redirect("/");
                });
                
            }else{
                req.flash("errorMessage", "All data fields must be filled out correctly!" );
                res.redirect("/passwordReset");
                
            }
        }
    });
    


});


module.exports = router;
