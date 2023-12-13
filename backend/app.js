const express=require('express');
const errorMiddleware=require('./middleware/error')
const app=express();
const cookieParser=require('cookie-parser');



//This woild encode the json data from request(just like urlencoded())
app.use(express.json());

//for accessing cookies if it is already set then 
app.use(cookieParser());  //must use ()


//importing the route named product
const product=require('./routes/productRoute');

//using the route(product) in middleware for all api starting with "/api/v1". So "/api/v1" is common pefixes for all apis
app.use('/api/v1',product);

const user=require('./routes/userRoutes')
////using the route(user) in middleware for all api starting with "/api/v1". So "/api/v1" is common pefixes for all apis
app.use('/api/v1',user);


//setting routes for router
const order=require("./routes/orderRoutes");
app.use('/api/v1',order);

//middleware for error
app.use(errorMiddleware);
 

module.exports=app;