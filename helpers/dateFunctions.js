
module.exports.getDayOfWeek = ()=>{
  
    const today = new Date();

    const options = {
       weekday: "long",
       day: "numeric",
       month: "long",
       year: "numeric" 
    };

    const day = today.toLocaleDateString("en-US",options);
   
    return day;

/**
 * resource for this date technique can be found at:
 *  https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
 * 
 */
};