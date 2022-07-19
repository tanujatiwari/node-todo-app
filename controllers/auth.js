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
        const user = { name: req.body.username }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
        console.log(accessToken)
        res.json({ accessToken: accessToken })
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
            const user = { name: req.body.username }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
            console.log(accessToken)
            res.json({ accessToken: accessToken })
        }
        else {
            res.send('Incorrect password')
        }
    } catch (e) {
        res.send('Something went wrong...')
        console.log(e)
    }
}