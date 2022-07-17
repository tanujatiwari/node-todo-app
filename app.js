require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./routes/index')
const path = require('path')
const methodOverride = require('method-override')

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use('/todo', routes)

app.listen(port, () => {
    console.log("Server started on port 3000")
})