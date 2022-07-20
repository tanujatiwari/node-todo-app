const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbHelper = require('../dbHelper/index')
const utils = require('../utils/index')

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
        let userId = await dbHelper.getUserId(username)
        let currDate = await utils.currDate();
        let storeSession = await dbHelper.storeSession(userId, currDate)
        let session = await dbHelper.getSessionId(userId);
        let sessionId = session.rows[0].session_id
        const user = { name: username, sessionId: sessionId, userId: userId }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '60m' })
        res.json({ accessToken: accessToken })
    } catch (err) {
        res.send('Something went wrong...')
        console.log(err)
    }
}

module.exports.login = async (req, res) => {
    let { username, password } = req.body
    try {
        let resp = await dbHelper.getUsername(username)
        if (resp.rows.length == 0) {
            return res.send('User not found')
        }
        if (await bcrypt.compare(password, resp.rows[0].password)) {
            let userId = await dbHelper.getUserId(username)
            let currDate = await utils.currDate();
            let storeSession = await dbHelper.storeSession(userId, currDate)
            let session = await dbHelper.getSessionId(userId);
            let sessionId = session.rows[0].session_id
            const user = { name: username, sessionId: sessionId, userId: userId }
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
        let user_id = await dbHelper.getUserId(req.user.name)
        let resp = await dbHelper.deleteUser(user_id);
        res.send('User successfully deleted')
    }
    catch (e) {
        res.send('cannot delete user. an error occured')
        console.log(e)
    }
}

module.exports.logout = async (req, res) => {
    try {
        let currDate = await utils.currDate()
        let resp = await dbHelper.invalidateToken(currDate, req.user.sessionId)
        res.send('Logged out successfully')
    }
    catch (e) {
        res.send('cannot logout. please try again later')
        console.log(e)
    }
}