const express = require('express')
const router = express.Router()
const crud = require('../controllers/index')

router.get('/all', crud.all)

router.post('/add', crud.newTodo)

router.delete('/delete/:id', crud.deleteTodo)

router.patch('/update/:id', crud.updateTodo)

router.get('/search', crud.searchTodo)

router.get('*', crud.notFound)

module.exports = router