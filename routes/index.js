const express = require('express')
const router = express.Router()
const crud = require('../controllers/index')
const authenticateToken = require('../middlewares/jwt')

router.use('/', authenticateToken)

router.get('/all', crud.all)

router.post('/add', crud.newTodo)

router.delete('/delete/:id', crud.deleteTodo)

router.patch('/update/:id', crud.updateTodo)

router.get('*', crud.notFound)

module.exports = router