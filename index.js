const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRouther = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const app = express();

// Middlewares
app.use(express.json());
app.use(authRouther);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter)

// Port Info
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", ()=>{
    console.log(`Connected at port ${PORT}`);
});


// Database Info
const DB = process.env.MONGODB_URI; //Database URL

// Connection to database 
mongoose.set('strictQuery', true);
mongoose.connect(DB).then(()=>console.log("Connected to Database successfully!")).catch((e)=>console.log(e));


