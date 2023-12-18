const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');    
const User = require("../models/user");
const authRouther = express.Router();
const auth = require('../middleware/auth');

authRouther.post("/api/signup", async (req, res)=>{
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.json({ msg:'User with same email address already exists!' })
        }

        const hassedPassword = await bcryptjs.hash(password, 8);

        let user = new User({
            email: email,
            name: name,
            password: hassedPassword 
        });
        user = await user.save();
        res.status(200).json(user);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
});



authRouther.post("/api/signin", async (req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if( !user ) {
            return res.status(400).json({msg: "User with this email does not exist!"});
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({msg: "Incorrect password."});
        }
        const token = jwt.sign({ id: user._id }, "PasswordKey");
        res.json({token, ...user._doc})
    } catch(e) {
        res.status(500).json({error: e.message});
    }
})

authRouther.post("/tokenIsValid", async(req, res)=>{
    try {
        const token = req.header('x-auth-token');
        if(!token) {
            return res.json({msg: "token not identified"});
        }
        const verified = await jwt.verify(token, 'PasswordKey')
        if(!verified) {
            return res.json({msg: "token not verified"});
        }
        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        res.json(true);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
})

authRouther.get('/', auth, async(req, res)=>{
    try {
        const user = await User.findById(req.user);
        res.status(200).json({...user._doc, token: req.token});
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
})
module.exports = authRouther;