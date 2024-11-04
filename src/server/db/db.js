import pg from 'pg'

const db = new pg.Pool({
    user: 'postgres',
    password: 'root',
    port: 5432,
    host: 'localhost',
    database: 'urfucart',
})

export default db