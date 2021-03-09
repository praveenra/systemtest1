const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/Auth.Controller')

router.post('/savedetails', AuthController.savedetails)

router.get('/getlist', AuthController.getlist)

router.put('/updatedetails', AuthController.updatedetails)

router.delete('/deletedetails', AuthController.deletedetails)

module.exports = router
