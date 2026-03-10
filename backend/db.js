const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:Vaibhav@2002@db.pdktleoqvqlkyiooqxeu.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;