const pool = require('../models/todo')

module.exports.all = (req, res) => {
    pool.connect(async (err, client, release) => {
        if (err)
            res.send(err.message)
        let resp = await client.query(`select * from todo`)
        res.send(resp.rows)
    })
}

module.exports.newTodo = (req, res) => {
    pool.connect(async (err, client, release) => {
        if (err)
            res.send(err.message)
        let resp = await client.query(`insert into todo(todo) values ('${req.body.todo}')`)
        res.redirect('/todo/all')
    })
}

module.exports.deleteTodo = (req, res) => {
    pool.connect(async (err, client, release) => {
        if (err)
            res.send(err.message)
        let resp = await client.query(`delete from todo where id='${req.params.id}'`)
        res.redirect('/todo/all')
    })
}

module.exports.updateTodo = (req, res) => {
    pool.connect(async (err, client, release) => {
        if (err)
            res.send(err)
        let iscompleted = req.body.isCompleted ? req.body.isCompleted : false
        // let todo = req.body.todo ? req.body.todo : await client.query(`select todo from todo where id='${req.params.id}'`)
        let resp = await client.query(`update todo set todo='${req.body.todo}', iscompleted=${iscompleted} where id='${req.params.id}'`)
        res.redirect('/todo/all')
    })
}

module.exports.notFound = (req, res) => {
    res.render('404')
}