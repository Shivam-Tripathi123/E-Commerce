const app=require('./app');
const dotenv=require('dotenv');
const connectDataBase = require('./config/database');


//handling  uncaught Exception
process.on("uncaughtException" , (err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting Down server due to uncaught Exception Error");
    process.exit(1);
})

//concting env file with app/server
dotenv.config({path:"backend/config/config.env"});


//Connecting To DataBAse
connectDataBase();

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${(process.env.PORT)}`)
})