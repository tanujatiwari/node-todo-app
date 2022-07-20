const jwt = require('jsonwebtoken')
const dbHelper = require('../dbHelper/index')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.send('Please register or login first')
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
        if (err) {
            return res.send('Please login')
        }
        req.user = user
        let isInvalidatedToken = await dbHelper.isInvalidatedToken(req.user.sessionId)
        if (isInvalidatedToken.rows[0].ended_on != null) {
            res.send("Your session has expired. Please login again")
        }
        next()
    })
}

module.exports = authenticateToken