const { Pool } = require('pg')

let pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASS,
    database: process.env.PGDB
})

pool.connect(async (err) => {
    if (err)
        console.log("Pool connect err:", err.message)
    console.log("Pool Connected")
})

module.exports = pool;