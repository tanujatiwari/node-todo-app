const dbHelper = require('../dbHelper/index')
const utils = require('../utils/index')

module.exports.all = async (req, res) => {
    let { q, offset = 0, limit = 5 } = req.query
    try {
        let user_id = await dbHelper.getUserId(req.user.name)
        if (q == undefined) {
            resp = await dbHelper.getAllTodos(user_id, limit, offset)
        }
        else {
            resp = await dbHelper.getFilteredTodos(user_id, q, limit, offset)
        }
        let dataToSend = {
            totalCount: Number(resp.rows[0].count),
            data: resp.rows
        };
        res.json(dataToSend)
    } catch (err) {
        res.send('An error occured')
        console.log(err)
    }
}

module.exports.newTodo = async (req, res) => {
    let { todo, deadline } = req.body;
    try {
        let currDate = await utils.currDate()
        let user_id = await dbHelper.getUserId(req.user.name)
        let resp = await dbHelper.addNewTodo(todo, deadline, currDate, user_id)
        res.redirect('/todo/all')
    } catch (err) {
        res.send(err)
    }
}

module.exports.deleteTodo = async (req, res) => {
    try {
        let user_id = await dbHelper.getUserId(req.user.name)
        let resp = await dbHelper.deleteTodo(req.params.id, user_id)
        res.redirect('/todo/all')
    } catch (e) {
        res.send('An error occured')
    }
}

module.exports.updateTodo = async (req, res) => {
    let { isCompleted, archived, todo } = req.body
    try {
        isCompleted = isCompleted ? isCompleted : false
        archived = archived ? archived : false
        let user_id = await dbHelper.getUserId(req.user.name)
        let resp = await dbHelper.updateTodo(todo, isCompleted, archived, req.params.id, user_id)
        res.redirect('/todo/all')
    } catch (e) {
        res.send(e)
    }
}

module.exports.notFound = (req, res) => {
    res.send('Page not found')
}