const mongoose = require('mongoose');

require('dotenv').config();

// const mongoURL = 'mongodb://localhost:27017/hotels'
// const mongoURL ='mongodb+srv://vrajat1997:rajathotel@cluster0.xdsz9k7.mongodb.net/'


// const mongoURL = process.env.DB_URL;

const localmongoURL = process.env.DB_URL_LOCAL;
// const mongoURL = process.env.DB_URL || 'mongodb://localhost:27017/hotels'; // Fallback URL
// console.log("the urls", mongoURL);

mongoose.connect(localmongoURL,{
useNewUrlParser:true,
useUnifiedTopology:true}

)

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("server is connected")
})

db.on('error',(e)=>{
    console.log("their are some error",e)
})


db.on('disconnected',()=>{
    console.log("server is disconnected")
})


module.exports =db;







