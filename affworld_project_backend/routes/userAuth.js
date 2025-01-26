const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../schemas/user.schema');

router.post('/Register', async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).send("User already Exists.")
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const user = new User({
            username:name,
            email,
            password:hashPassword,
        });
        await user.save();
        res.status(200).send('Successful')

    }
    catch(err){
        throw new Error(err.message);
    }

})

router.post('/Login', async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userExist = await User.findOne({email})
        
        if(!userExist){
            return res.status(400).send("Wrong Email or Password")
        }
        const validPass = await bcrypt.compare(password, userExist.password);
        if(!validPass){
            return res.status(400).send("Wrong Email or Password")
        }
        const token = jwt.sign({_id:userExist._id},process.env.JWTOKEN);
        res.status(200).json({
            name:userExist.username,
            email:userExist.email,
            token,
        })
    }
    catch(err){
        throw new Error(err.message);
    }

})

router.get('/getUser', async (req,res)=>{
    try{
        const { email } = req.query;
        const userExist = await User.findOne({email})
        if(!userExist){
            return res.status(400).send("User not Found")
        }
        res.status(200).json({
            name:userExist.username,
            email:userExist.email,
        })
    }
    catch(err){
        throw new Error(err.message);
    }

})

router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${req.user.token}`);
    }
);

module.exports = router;