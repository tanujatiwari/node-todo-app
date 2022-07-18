require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./routes/index')
const authRoutes = require('./routes/auth')
const path = require('path')

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/todo', routes)
app.use('/', authRoutes)

app.listen(port, () => {
    console.log("Server started on port 3000")
})