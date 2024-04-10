const express = require('express');
const app = express();
const db = require('./db')
const bodyParser = require('body-parser');
require('dotenv').config();


app.use(bodyParser.json());
const PORT = process.env.PORT || 4400 ;
const { jwtAuthMiddleWare} = require("./jwt");

app.listen(PORT, () => {
    console.log("the server is start",PORT);
})

const userRoutes=require("./routes/userRoute")
const candidateRoutes=require("./routes/candidateRoute")


app.use('/user',userRoutes)
app.use('/candidate',candidateRoutes)

