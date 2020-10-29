var express = require('express');
var router = express.Router();
const _ = require("lodash");

const User = require(__dirname+"/../models/userModel.js").User;


const itemModel =  require(__dirname+"/../models/itemModel.js");
const Item = itemModel.Item;
const listModel = require(__dirname+"/../models/listModel.js");
const List = listModel.List;


/**middleware function to check for authentication if a person trys to see 
 * a route that starts with /list which is currently the whole application
 */
const isUserAuthenticated =(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

router.use(isUserAuthenticated);

//route shows all lists in one list, which allows you to click on a
//list to take you directly to that list to add or remove items
router.get("/show",(req,res)=>{
    
                    // gets all lists with that current user's userTagId
                    //NOTE: when a user create a list the list gets the users userTagId
                    //which connects the list with user
                    req.app.set("loggedInUserTag",req.user.userTag);
                    
                //find all lists that have this userId
                List.find({userTagId: req.app.get("loggedInUserTag")},(err,foundLists)=>{
              
                if(err){
                    console.log("you have an error in List.find");
                }
                res.render("lists",{lists:foundLists, usersName: req.user.firstName});
            
            });
           
            
    
});


//create a new list
router.post("/create",(req,res)=>{
    

    const listName = _.startCase(_.toLower(req.body.newListName));//A1
   //combination of lodash comands to make the first char of every word upperecase

    const list = new List({
        name:listName,
        items:[],
        userTagId: req.app.get("loggedInUserTag")
    });

    list.save();

    res.redirect("/list/show");

});

//remove a list only if you provide a passcode
router.post("/delete",(req,res)=>{

    //get data from form to determine which list to delete
const listIdToDelete = req.body.checkBox;
const deletePassCode = req.body.passcode;

//does passcode match server passcode
if(deletePassCode === req.user.passcode){
    List.deleteOne({_id:listIdToDelete},(error)=>{
        if(error){
            console.log(error);
        }else{
            console.log("list has been deleted!");
            res.redirect("/list/show");
        }
    });
}else{
    res.redirect("/list/show");
}

});




router.get("/viewList/:listId",(req,res)=>{
   
    const idOfListToshow = req.params.listId;

    List.findById(idOfListToshow,(error,listFound)=>{
        if(error){
            console.log(error);
        }else{
            


            //renders page with list and items
            res.render("list",{list:listFound});
        }
    })

});


router.post("/addNewItemToList",(req,res)=>{
    
    const listId = req.body.listId;
    const newItem = req.body.newItem;
    console.log(newItem);

    List.findById(listId,(err,listFound)=>{
        
        if(err){
            console.log(err)
        }else{

          numberOfItems = listFound.items.length;

            const item = new Item({
                name:newItem,
                orderNumber:numberOfItems+1
            });

            listFound.items.push(item);
        listFound.save();

        }
        
    });
    //takes you back to actual list and see the new item addded to list
    res.redirect("viewList/"+listId);
});


router.post("/titleEdit",(req,res)=>{
    const listId = req.body.listId;

    const newListTitle = req.body.listTitleEditField;

    //using title id look for it in db
    List.updateOne({_id:listId},{name:newListTitle},(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("you have updated list title");
        }
    });

   

    //redirect to list with new name
    res.redirect("/list/viewList/"+listId);
   
});


module.exports = router;