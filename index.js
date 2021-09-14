const mongoCon=require('./db');
const express=require('express');
const app=express();

mongoCon();

app.get('/',(req,res)=>{
    res.send("Hey buddy");
});
app.get('/gg',(req,res)=>{
    res.send("Yeah u get gg \\|\\");
});
app.listen(2020,()=>{
    console.log("Running on http://localhost:2020");
})
