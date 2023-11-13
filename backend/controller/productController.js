const Product = require("../models/productModel");

//Creating Product BY ADMIN
exports.createProducts = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

//Fetching All Products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
};

//updating Products(Only by Admin)
exports.updateProduct = async (req, res, next) => {

  let product =await  Product.findById(req.params.id);
  if (!product) {
     return res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
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
};


//To Delete product(only by admin)

exports.deleteProduct=async (req,res,next)=>{

  const product=await Product.findById(req.params.id);
 
  if(!product)
  {
    return res.status(500).json({
      success: false,
      message: "Product Not Found",
  })
}

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message:"Product is successfully deleted"
  });
}


//Get Single Product(Get Single Product Details)

exports.getProductDetails=async (req,res,next)=>{
  // const product=await Product.findOne({_id:req.params.id}); 
  const product=await Product.findById(req.params.id);

  if(!product)
  {
    return res.status(500).json({
    success: false,
      message: "Product Not Found",
  })
  }

  res.status(200).json({
    success:true,
    product
  })
}
