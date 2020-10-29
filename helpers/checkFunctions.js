// function for checking if an object is empty, used in the password reset route
 exports.isObjectEmpty = (obj)=>{
    for(var property in obj) {
        if(obj.hasOwnProperty(property)){
                               
            return false;
        }
            
    }
    return true;
}

// function to check for an emtpy string used in the login route
exports.isInputEmpty = (inputData)=>{
    if(inputData === null || inputData === undefined || inputData.length === 0){
            return true;
        }else{
            return false;
        }
}; 

