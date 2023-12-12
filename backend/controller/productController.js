const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require('../middleware/catchAsyncError');
const ApiFeatures=require('../utils/apiFeatures');

//Creating Product BY ADMIN
exports.createProducts = catchAsyncError(async (req, res, next) => {

  req.body.user=req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
})

//Fetching All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {

  const resultPerPage=5;

  const productCount=await Product.countDocuments();

  const apifeatures =new ApiFeatures( Product.find({}), req.query).search().filter().pagination(resultPerPage);
  const products = await apifeatures.query;

  res.status(200).json({
    success: true,
    products,
    productCount
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



/* REVEIWS */


//create new review or else update it

exports.createProductReview=catchAsyncError(async(req,res,next)=>{

  const {rating,comment,productid}=req.body;
  const review={
    user:req.user._id,//logged in person who is giving id got saved in db
    name:req.user.name,
    rating:Number(rating),
    comment
  }

  //finding the product whose review needed

  const product=await Product.findById(productid);

  //now in the reviews field of this product we ll check whether current logged in user is already reviewed or he is first time reviewer
  // well check id of this user if present in reviews array of product model or not
const isReviewed=product.reviews.find(a=>a.user.toString()===req.user._id.toString())
if(isReviewed)
{
  product.reviews.forEach(a=>{
  if(a.user.toString()===req.user._id.toString())
  {
    a.rating=rating,
    a.comment=comment;
  }
})
}
else
{
  product.reviews.push(review);
  product.numOfReviews=product.reviews.length;
}
//"rating" is a field in reviews array and 
//"ratings" is overall rating of a product
let avg=0;
product.ratings=product.reviews.forEach(a=>{
  avg=avg + a.rating;
})
avg=avg/product.reviews.length
  
product.ratings=avg;

await product.save({validateBeforeSave:false});
res.status(200).json({
  success:true
})

})


//Get all reviews os a single Product

exports.getProductReviews=catchAsyncError(async(req,res,next)=>{

  //here we have pass id of product in query whose reviews needed

  const product=await Product.findById(req.query.id);
  if(!product)
  {
    return next(new ErrorHandler("Product Do not Exist",400));
  }

  res.status(200).json({
    success:true,
    reviews:product.reviews
  })
})


//To delete a particular review of a particular product hence both ids needed

exports.deleteReviews=catchAsyncError(async(req,res,next)=>{

  const product=await Product.findById(req.query.productId);
  if(!product)
  {
    return next(new ErrorHandler("Product Do not Exist",400));
  }

  //this will filter out and save the review whose id not equal to recieved od
  const reviews=product.reviews.filter(a=>a._id.toString()!==req.query.id.toString())
  let avg=0;
 reviews.forEach(a=>{
  avg=avg + a.rating;
})
avg=avg/reviews.length
  
const ratings=avg;
const numOfReviews=reviews.length

await Product.findByIdAndUpdate(req.query.productId,{
  reviews,ratings,numOfReviews
},{
  new:true,
  runValidators:true,
  useFindAndModify:false
})

res.status(200).json({
  success:true,
  message:"Review Deleted SuccessFully"
})
})

