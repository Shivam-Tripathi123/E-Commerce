const express=require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updatePrile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controller/userController');
const { isAuthenticatedUser } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/authorizeRole');

const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

/*USER ROUTES*/
router.route('/me').get(isAuthenticatedUser,getUserDetails);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').post(isAuthenticatedUser,updatePrile);


/*ADMIN ROUTES */
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"),getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles("admin"),getSingleUser);
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles("admin"),updateUserRole);
router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRoles("admin"),deleteUser);


module.exports=router;

