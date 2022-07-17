const { Pool } = require('pg')

let pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: process.env.PGPASS,
    database: 'migrationdb'
})

module.exports = pool;