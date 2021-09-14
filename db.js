const mongoose=require('mongoose');
const mongoUri="mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const mongoConnect=()=>{
    mongoose.connect(mongoUri,()=>{
        console.log("Connection established");
    })
}
module.exports=mongoConnect