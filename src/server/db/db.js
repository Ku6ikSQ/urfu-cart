import pg from 'pg'

dotenv.config();

const db = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'urfucart',
});

export default db