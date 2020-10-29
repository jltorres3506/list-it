var express = require('express');
var router = express.Router();

const listModel = require(__dirname+"/../models/listModel.js");
const List = listModel.List;

 //route used to delete a single item in a list
 router.post("/delete",(req,res)=>{

    const checkedItemId =  req.body.checkBox;
    const listId = req.body.listId;
   
    // this is the way to delete a document that is another document using the $pull
    List.findOneAndUpdate({_id:listId},{$pull:{items:{_id:checkedItemId}}},(err,foundList)=>{
           if(err){
               console.log("you have a problem!");
           }
        });
       
        res.redirect("/list/viewList/"+listId);
   
   });




   router.post("/edit",(req,res)=>{

    const itemText = req.body.editItemInput;
    const itemId = req.body.itemId;
    const listId = req.body.listId;
 
    //find list of based on id 
    List.findById(listId,(err,listFound)=>{   
        
         //once list is found go into items array find item with specific id change text and save
         listFound.items.find((itemFound)=>{
                 if( itemFound._id == itemId){
                     itemFound.name = itemText;
                     listFound.save()
                 }
         });
 
         
         res.redirect("/list/viewList/"+listId);
     });
 
 });
 

 router.post("/editOrder",(req,res)=>{
    const newOrderNumber = req.body.orderNumberField;
    const listId = req.body.listId;
    const itemId = req.body.itemId;

    function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) };


    if(isNumber(newOrderNumber)){
        
    
            //find list of based on id 
        List.findById(listId,(err,listFound)=>{   
            
            //once list is found go into items array find item with specific id change text and save
            listFound.items.find((itemFound)=>{
                    if( itemFound._id == itemId){
                        itemFound.orderNumber = newOrderNumber;
                        listFound.save()
                    }
            });

            
            res.redirect("/list/viewList/"+listId);
        });

    }else{

    }

});
 
   module.exports = router;