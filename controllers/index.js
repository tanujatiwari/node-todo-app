const pool = require('../models/todo')

module.exports.all = async (req, res) => {
    let resp = await pool.query(`select * from todo`)
    res.send(resp.rows)
}

module.exports.newTodo = async (req, res) => {
    let ts = new Date();
    let date = ts.getDate();
    let month = ts.getMonth();
    let year = ts.getFullYear();
    let currDate = `${year}-${month}-${date}`;
    let resp = await pool.query(`insert into todo(todo_name, deadline, created_on) values ('${req.body.todo}','${req.body.deadline}','${currDate}')`)
    res.redirect('/todo/all')
}

module.exports.deleteTodo = async (req, res) => {
    let resp = await pool.query(`delete from todo where todo_id='${req.params.id}'`)
    res.redirect('/todo/all')
}

module.exports.updateTodo = async (req, res) => {
    let iscompleted = req.body.isCompleted ? req.body.isCompleted : false
    let resp = await pool.query(`update todo set todo_name='${req.body.todo}', iscompleted=${iscompleted} where todo_id='${req.params.id}'`)
    res.redirect('/todo/all')
}

module.exports.notFound = (req, res) => {
    res.render('404')
}