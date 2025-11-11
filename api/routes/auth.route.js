const express = require('express')
const router = express.Router()
const { requireSignIn, currentUserController } = require('../controllers/user.controller')

// protected home route - returns authenticated user
router.get('/home', requireSignIn, currentUserController)

module.exports = router
