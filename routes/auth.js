const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const authenticateToken = require('../middlewares/index')

router.post('/register', auth.register)

router.post('/login', auth.login)

router.delete('/user', authenticateToken, auth.deleteUser)

module.exports = router