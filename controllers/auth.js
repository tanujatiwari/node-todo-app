const pool = require('../models/todo')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.register = async (req, res) => {
    try {
        const checkUser = await pool.query(`select * from users where username='${req.body.username}'`)
        if (checkUser.rows.length !== 0) {
            return res.send('User already exists!')
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        let resp = await pool.query(`insert into users(username, password) values('${req.body.username}','${hashedPassword}')`)
        res.send('User registered!')
    } catch (err) {
        res.send('Something went wrong...')
    }
}

module.exports.login = async (req, res) => {
    try {
        let resp = await pool.query(`select * from users where username='${req.body.username}'`)
        if (resp.rows.length == 0) {
            return res.send('User not found')
        }
        if (await bcrypt.compare(req.body.password, resp.rows[0].password)) {
            res.send('Logged in!')
        }
        else {
            res.send('Incorrect password')
        }
    } catch (e) {
        res.send('Something went wrong...')
        console.log(e)
    }
}