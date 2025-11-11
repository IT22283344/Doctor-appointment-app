const express = require('express')
const router = express.Router()
const { requireSignIn, currentUserController } = require('../controllers/user.controller')

router.get('/home', requireSignIn, currentUserController)

module.exports = router
