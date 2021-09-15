const mongoCon=require('./db');
const express=require('express');
const app=express();

mongoCon();

app.use(express.json());
//Requried Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/note',require('./routes/notes'));


app.listen(2020,()=>{
    console.log("Running on http://localhost:2020");
})
