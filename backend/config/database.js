const mongoose=require('mongoose');

const connectDataBase=()=>{
mongoose.connect(process.env.DB_URI).then((data)=>{
    console.log((`MongoDB Connected with server : ${data.connection.host}`))
}).catch((err)=>{
    console.log(err);
})
}
module.exports=connectDataBase;