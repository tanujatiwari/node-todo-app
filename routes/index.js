const express = require('express')
const router = express.Router()
const controller = require('../controllers/index')

router.get('/all', controller.all)

router.post('/add', controller.newTodo)

router.delete('/delete/:id', controller.deleteTodo)

router.patch('/update/:id', controller.updateTodo)

router.get('*', controller.notFound)

module.exports = router