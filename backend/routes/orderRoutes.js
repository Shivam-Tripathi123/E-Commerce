const express=require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require('../middleware/authorizeRole');

const { newOrder, getSingleOrder, myOrder, getAllOrders, updateOrder, deleteOrder } = require("../controller/orderController");
const router=express.Router();


//create new order
router.route('/order/new').post(isAuthenticatedUser,newOrder);

//get a single order details

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)

//get all orders details
router.route('/orders/me').get(isAuthenticatedUser,myOrder);//write "/orders/me" if u write "/order/me" then on hitting the api with         "/order/me" the above rutes is called with "me" taking as id as in params


/* ADMIN ROUTES */

//to get all users
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);

//to update status of a particu;ar order
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder);

//to delete an order
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);

module.exports=router;