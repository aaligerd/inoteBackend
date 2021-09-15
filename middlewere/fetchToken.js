const jwt=require('jsonwebtoken');

const JWT_SECRET_SIGN = "alchamyaaligerd6Feb1999#";
const fetchToken=(req,res,next)=>{
    try {
        
        const authToken=req.header('authToken');
        if(!authToken){
            return res.status(401).json({error:"Provide a authenticaion"});
        }
        const data=jwt.verify(authToken,JWT_SECRET_SIGN);
        req.user=data.user;
        next();
    } catch (error) {
        
        res.status(401).send({error:"You are Unautharized"});
    }
    
}
module.exports=fetchToken;