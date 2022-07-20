const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbHelper = require('../dbHelper/index')

module.exports.register = async (req, res) => {
    let { username, password } = req.body
    try {
        const checkUser = await dbHelper.getUsername(username)
        if (checkUser.rows.length !== 0) {
            return res.send('User already exists!')
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        let resp = await dbHelper.createUser(username, hashedPassword)
        const user = { name: username }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
        res.json({ accessToken: accessToken })
    } catch (err) {
        res.send('Something went wrong...')
    }
}

module.exports.login = async (req, res) => {
    let { username, password } = req.body
    try {
        console.log(req.body)
        let resp = await dbHelper.getUsername(username)
        if (resp.rows.length == 0) {
            return res.send('User not found')
        }
        if (await bcrypt.compare(password, resp.rows[0].password)) {
            const user = { name: username }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
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

module.exports.deleteUser = async (req, res) => {
    try {
        let user_id = await dbHelper.getUserId(req.user)
        let resp = await dbHelper.deleteUser(user_id);
        res.send('User successfully deleted')
    }
    catch (e) {
        res.send('cannot delete user. an error occured')
        console.log(e)
    }
}