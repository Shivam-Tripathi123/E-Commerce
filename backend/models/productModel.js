const mongoose=require('mongoose');

const productSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Enter Name of product"],
            trim:true
        },
        description:{
            type:String,
            required:[true,"Enter Description of Product"]
        },
        price:{
            type:Number,
            required:[true,"Enter Description of Product"],
            maxlength:[8,"Price Cannot exceed 8 figures"]
        },
        rating:{
            type:Number,
            default:0
        },
        images:[{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }],
        category:{
            type:String,
            required:[true,"Enter Product Category"]
        },
        stock:{
            type:Number,
            required:[true, "Please Enter Product Stock"],
            maxlength:[4],
            default:1
        },
        numOfReviews:{
            type:Number,
            default:0
        },
        reviews:[{
            name:{
                type:String,
                 required:true
            },
            rating:{
                type:Number,
                 required:true
            },
            comment:{
                type:String,
                required:true,
            }
        }],
        createdAt:{
            type:Date,
            default:Date.now
        }
    }
)

module.exports=mongoose.model("Product",productSchema);