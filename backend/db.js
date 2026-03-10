const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:YOUR_PASSWORD@db.pdktleoqvqlkyiooqxeu.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;