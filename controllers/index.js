const pool = require('../models/todo')

module.exports.all = async (req, res) => {
    try {
        let resp = await pool.query(`select * from todo order by deadline, created_on desc`)
        res.send(resp.rows)
    } catch (err) {
        res.send('An error occured')
    }
}

module.exports.newTodo = async (req, res) => {
    try {
        let ts = new Date();
        let date = ts.getDate();
        let month = ts.getMonth();
        let year = ts.getFullYear();
        let currDate = year + "-" + month + "-" + date;
        let resp = await pool.query(`insert into todo(todo_name, deadline, created_on) values ('${req.body.todo}','${req.body.deadline}','${currDate}')`)
        res.redirect('/todo/all')
    } catch (err) {
        res.send(err)
    }
}

module.exports.deleteTodo = async (req, res) => {
    try {
        let resp = await pool.query(`delete from todo where todo_id='${req.params.id}'`)
        res.redirect('/todo/all')
    } catch (e) {
        res.send('An error occured')
    }
}

module.exports.updateTodo = async (req, res) => {
    try {
        let iscompleted = req.body.isCompleted ? req.body.isCompleted : false
        let resp = await pool.query(`update todo set todo_name='${req.body.todo}', iscompleted=${iscompleted} where todo_id='${req.params.id}'`)
        res.redirect('/todo/all')
    } catch (e) {
        res.send(e)
    }
}

module.exports.searchTodo = async (req, res) => {
    try {
        let resp = await pool.query(`select * from todo where todo_name ilike '%${req.query.q}%'`)
        res.send(resp.rows)
    } catch (e) {
        res.send('Something went wrong')
    }
}

module.exports.notFound = (req, res) => {
    res.render('404')
}