const mongoose = require('mongoose');
const { productSchema } = require('./product')

var validateEmail = (email)=>{
    var regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regx.test(email);
}

const userSchema = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"], 
        match: [/^[a-zA-Z]+$/, 'is invalid'],
        trim: true,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        trim: true,
        unique: true,
        validate:[validateEmail,'Please Enter a valid Email Address']
    },
    password: {
        type: String, 
        required: true
    }, 
    address: {
        type: String,
        default: ""
    }, 
    type: {
        type: String,
        default: "user"
    },
    cart: [
        {
            product : productSchema,
            quantity: {
                type: Number, 
                required: true
            }
        }
    ]
});

const User = mongoose.model('User', userSchema); //Path defines the collection name in database

module.exports = User;

