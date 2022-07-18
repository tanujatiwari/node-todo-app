const { Pool } = require('pg')

let pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASS,
    database: process.env.PGDB
})

module.exports = pool;