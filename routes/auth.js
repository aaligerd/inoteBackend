const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET_SIGN = "alchamyaaligerd6Feb1999#";
//create a user using POST "/api/auth/createuser" no auth requried
router.post('/createuser', [
    body('name', 'enter a valid name').isLength({ min: 5 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'enter atlest 5 charecters').isLength({ min: 5 })
], async (req, res) => {
    try {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({
                errorMsg: "sorry email already exist"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);


        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET_SIGN);


        // res.json(user);
        res.json({authToken });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error:"Internal Server Error"});
    }
})


//athenticat user for login using POST "/api/auth/login" login method
router.post('/login', [body('email', 'enter a valid email').isEmail(),body('password','Need a password').exists()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let{email,password}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please enter right credentials"})
        }
        const passcheck = await bcrypt.compare(password,user.password);
        if(!passcheck){
            return res.status(400).json({error:"Please enter right credentials"})
        }

        let data={
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET_SIGN);


        res.json({authToken});

    } catch (error) {
        console.log(error.message);
        res.status(400).json({error:"Internal Server Error"});
    }
});

module.exports = router;

