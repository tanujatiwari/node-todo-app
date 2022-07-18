const pool = require('../models/todo')

module.exports.all = async (req, res) => {
    let resp = await pool.query(`select * from todo`)
    res.send(resp.rows)
}

module.exports.newTodo = async (req, res) => {
    let resp = await pool.query(`insert into todo(todo) values ('${req.body.todo}')`)
    res.redirect('/todo/all')
}

module.exports.deleteTodo = async (req, res) => {
    let resp = await pool.query(`delete from todo where id='${req.params.id}'`)
    res.redirect('/todo/all')
}

module.exports.updateTodo = async (req, res) => {
    let iscompleted = req.body.isCompleted ? req.body.isCompleted : false
    let resp = await pool.query(`update todo set todo='${req.body.todo}', iscompleted=${iscompleted} where id='${req.params.id}'`)
    res.redirect('/todo/all')
}

module.exports.notFound = (req, res) => {
    res.render('404')
}