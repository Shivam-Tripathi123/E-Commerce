const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require('../middleware/catchAsyncError')

//Creating Product BY ADMIN
exports.createProducts = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
})

//Fetching All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
})

//updating Products(Only by Admin)
exports.updateProduct = catchAsyncError(async (req, res, next) => {

  let product =await  Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not Found",500))
    }
  

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

   res.status(200).json({
    success: true,
    product
  });
})


//To Delete product(only by admin)

exports.deleteProduct=catchAsyncError(async (req,res,next)=>{

  const product=await Product.findById(req.params.id);
 
  if(!product)
  {
    return next(new ErrorHandler("Product not Found",500));
}

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message:"Product is successfully deleted"
  });
})


//Get Single Product(Get Single Product Details)

exports.getProductDetails=catchAsyncError(async (req,res,next)=>{
  // const product=await Product.findOne({_id:req.params.id}); 
  const product=await Product.findById(req.params.id);

  if(!product)
  {
    return next(new ErrorHandler("Product Not Found",404));
  }

  res.status(200).json({
    success:true,
    product
  })
})
