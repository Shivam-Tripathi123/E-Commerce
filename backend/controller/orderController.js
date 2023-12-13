const Order=require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require('../middleware/catchAsyncError');
const Product = require("../models/productModel");


//creating Order(well get all required details in req.body)

exports.newOrder=catchAsyncError(async(req,res,next)=>{

    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;

    const order=await Order.create({shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice, paidAt:Date.now(),user:req.user._id});

    res.status(201).json({
        success:true,
        order
    })

})


//get single Order(we'll also fetch the user who has created that order expicitly) by logged in user

exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{

    const order=await Order.findById(req.params.id).populate("user", "name email");

    if(!order)
    {
        return next(new ErrorHandler("Order not found",400))
    }

    return res.status(200).json({
        success:true,
        order
    })
    
})


//Get all order detail of a logged in user by himself

exports.myOrder=catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find({user:req.user._id});
    
    
    res.status(200).json({
        success:true,
        orders
    })
})




/* Routes For ADMIN */


//get all order by admin  (here we'll also send total amount of these all orders)

exports.getAllOrders=catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find();

    //getting total amount

    let totalAmount=0;
    orders.forEach(a=>{
        totalAmount+=a.totalPrice
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})


//Update Order Status by Admin

exports.updateOrder=catchAsyncError(async(req,res,next)=>{

    const order=await Order.findById(req.params.id);

    if(!order)
    {
        return next(new ErrorHandler("Order not found",400))
    }

    if(order.orderStatus==="Delivered")
    {
        return next(new ErrorHandler("Product is already delivered ",400))
    }

    order.orderItems.forEach(async (a)=>{
        await updateStock(a.product, a.quantity);
    })

    order.orderStatus=req.body.status;

    if(req.body.status==="Delivered")
    {
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    message:"Status update successfully"
    })
})


async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.stock = product.stock-quantity;
    await product.save({validateBeforeSave:false})
}



//Delete an order by ADMIN

exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findByIdAndDelete(req.params.id)

    if(!order)
    {
        return next(new ErrorHandler("Order not found",400))
    }

    return res.status(200).json({
        success:true,
        message:"Order Deleted SuccessFully"
    })
})
