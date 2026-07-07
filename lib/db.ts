import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Example for local development:
  // user: "postgres",
  // host: "localhost",
  // database: "telecom_db",
  // password: "password",
  // port: 5432,
});

export default pool;
