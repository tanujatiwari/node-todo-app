const pool = require('../models/todo')

module.exports.all = async (req, res) => {
    try {
        let userID = await pool.query(`select user_id from users where username='${req.user.name}'`)
        let user_id = (userID.rows[0].user_id)
        let queryParams = req.query.q;
        let resp;
        if (req.query.q == undefined) {
            resp = await pool.query(`select * from todo where user_id='${user_id}' order by deadline, created_on desc`)
        }
        else {
            resp = await pool.query(`select * from todo where user_id='${user_id}' and todo_name ilike '%${queryParams}%'`)
        }
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
        let userID = await pool.query(`select user_id from users where username='${req.user.name}'`)
        let user_id = (userID.rows[0].user_id)
        let resp = await pool.query(`insert into todo(todo_name, deadline, created_on,user_id) values ('${req.body.todo}','${req.body.deadline}','${currDate}','${user_id}')`)
        res.redirect('/todo/all')
    } catch (err) {
        res.send(err)
    }
}

module.exports.deleteTodo = async (req, res) => {
    try {
        let userID = await pool.query(`select user_id from users where username='${req.user.name}'`)
        let user_id = (userID.rows[0].user_id)
        let resp = await pool.query(`delete from todo where todo_id='${req.params.id}' and user_id='${user_id}'`)
        res.redirect('/todo/all')
    } catch (e) {
        res.send('An error occured')
    }
}

module.exports.updateTodo = async (req, res) => {
    try {
        let iscompleted = req.body.isCompleted ? req.body.isCompleted : false
        let archived = req.body.archived ? req.body.archived : false
        let userID = await pool.query(`select user_id from users where username='${req.user.name}'`)
        let user_id = (userID.rows[0].user_id)
        let resp = await pool.query(`update todo set todo_name='${req.body.todo}', iscompleted=${iscompleted}, archived=${archived} where todo_id='${req.params.id}' and user_id='${user_id}'`)
        res.redirect('/todo/all')
    } catch (e) {
        res.send(e)
    }
}

module.exports.notFound = (req, res) => {
    res.send('Page not found')
}