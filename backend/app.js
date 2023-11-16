const express=require('express');
const errorMiddleware=require('./middleware/error')
const app=express();




//This woild encode the json data from request(just like urlencoded())
app.use(express.json());


//importing the route named product
const product=require('./routes/productRoute');

//using the route(product) in middleware for all api starting with "/api/v1". So "/api/v1" is common pefixes for all apis
app.use('/api/v1',product);


//middleware for error
app.use(errorMiddleware);
 

module.exports=app;