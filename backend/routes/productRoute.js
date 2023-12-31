const express=require('express');
const { getAllProducts ,createProducts, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReviews} = require('../controller/productController');
const { isAuthenticatedUser } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/authorizeRole');


//this will help us to use functionality like app.get() , app.post() in other file without importing express in app=express()  by just importing router in other files and doing router.get() router.post()
const router=express.Router();
//we are doing  router.get() instead of app.get() because we want a common prefix /product/ pr /user/.
//This router must be connected with app/server.js in middleware after importing router. and after it we can access all url using router
//at that middleware we can add a common prefixes eg app.use("user", router).   Now every api via route would already have "user" in it.


//this means for api  with prefix "product"  and request "get" goto controller "getALLProduct"
//previously all request with starting api "api/v1" is coming on this route() so the below line would goto getAllProducts controller on "/api/v1/products" 
//Fetching All Products
router.route('/products').get( getAllProducts);//eqvivalent to  "router.get('/products/' , getAllProducts)"
//router.route('/products').get().post().put()      i.e. multiple request is handled in same line for same url with diff req method
//so All method get chained using ".route(url)"


//Creating Product BY ADMIN
router.route('/admin/products/new').post(isAuthenticatedUser , authorizeRoles("admin") ,createProducts);


//Updating Products
router.route('/admin/product/:id').put(isAuthenticatedUser , authorizeRoles("admin") ,updateProduct)


//deleting Products
router.route('/admin/product/:id').delete(isAuthenticatedUser , authorizeRoles("admin") ,deleteProduct);

//Find One Product (Get Details)
router.route('/product/:id').get(getProductDetails);

//adding review bt current logged in user
router.route('/review').put(isAuthenticatedUser,createProductReview);

//to get all review of a product
router.route('/reviews').get(getProductReviews);

//to delete a particular review of a particular product
router.route('/reviews').delete(isAuthenticatedUser,deleteReviews);

module.exports=router;