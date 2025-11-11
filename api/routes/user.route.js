const express=require('express')
const { registerController, LoginCntroller,updateUserController ,requireSignIn} = require('../controllers/user.controller')

const router=express.Router()

router.post("/register",registerController)
router.post("/login",LoginCntroller)
router.put("/update-user",requireSignIn,updateUserController)

module.exports=router