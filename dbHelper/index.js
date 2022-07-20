const pool = require('../models/todo')

module.exports.getUserId = async (name) => {
    let userID = await pool.query(`select user_id from users where username='${name}'`)
    return (userID.rows[0].user_id)
}

module.exports.deleteUser = async (user_id) => {
    return await pool.query(`update users set is_archived=true where user_id='${user_id}'`)
}

module.exports.getUsername = async (username) => {
    return await pool.query(`select * from users where username='${username}' and is_archived=false`);
}

module.exports.createUser = async (username, hashedPassword) => {
    return await pool.query(`insert into users(username, password) values('${username}','${hashedPassword}')`)
}

module.exports.getAllTodos = async (user_id, limit, offset) => {
    return pool.query(` 
    with cte_total as(
        select * from todo where user_id='${user_id}'
    ) 
    select * from cte_total inner join (select count(*) from cte_total) as sub on TRUE order by deadline, created_on desc limit ${limit} offset ${offset}
    `)
}

module.exports.getFilteredTodos = async (user_id, q, limit, offset) => {
    return pool.query(`
        with cte_total as(
            select * from todo where user_id='${user_id}'
        )
        select * from cte_total inner join (select count(*) from cte_total) as sub on true where user_id='${user_id}' and todo_name ilike '%${q}%' order by deadline, created_on desc limit ${limit} offset ${offset}`
    );
}

module.exports.addNewTodo = async (todo, deadline, currDate, user_id) => {
    return pool.query(`insert into todo(todo_name, deadline, created_on,user_id) values ('${todo}','${deadline}','${currDate}','${user_id}')`)
}

module.exports.deleteTodo = async (id, user_id) => {
    return pool.query(`delete from todo where todo_id='${id}' and user_id='${user_id}'`)
}

module.exports.updateTodo = async (todo, iscompleted, archived, id, user_id) => {
    return pool.query(`update todo set todo_name='${todo}', iscompleted=${iscompleted}, archived=${archived} where todo_id='${id}' and user_id='${user_id}'`)
}

module.exports.getSessionId = async (userId) => {
    return pool.query(`select session_id from sessionStorage where user_id='${userId}' `)
}

module.exports.storeSession = async (userId, currDate) => {
    return pool.query(`insert into sessionStorage(user_id, created_on) values('${userId}', '${currDate}') `)
}

module.exports.invalidateToken = async (currDate, sessionId) => {
    return pool.query(`update sessionStorage set ended_on= '${currDate}' where session_id='${sessionId}'`)
}

module.exports.isInvalidatedToken = async (sessionId) => {
    return pool.query(`select ended_on from sessionStorage where session_id ='${sessionId}'`)
}