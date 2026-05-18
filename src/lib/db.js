// import MariaDB client (using namespace import because default import doesn't work)
import * as mariadb from "mariadb";

// create a connection pool to reuse connections efficiently. values come from .env.local (each user has their own)
const pool = mariadb.createPool({           // database config
  host: process.env.DB_HOST,        
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,    
  port: Number(process.env.DB_PORT),
  connectionLimit: 5,               
});

// export pool so it can be used in API routes
export default pool;