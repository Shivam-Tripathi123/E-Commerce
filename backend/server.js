const app=require('./app');
const dotenv=require('dotenv');
const connectDataBase = require('./config/database');

//concting env file with app/server
dotenv.config({path:"backend/config/config.env"});


//Connecting To DataBAse
connectDataBase();

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${(process.env.PORT)}`)
})