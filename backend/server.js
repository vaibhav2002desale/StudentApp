const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* GET STUDENTS */

app.get("/students", async (req, res) => {
  const students = await pool.query("SELECT * FROM students");
  res.json(students.rows);
});

/* ADD STUDENT */

app.post("/students", async (req, res) => {
  const { name, email, age } = req.body;

  const newStudent = await pool.query(
    "INSERT INTO students (name,email,age) VALUES ($1,$2,$3) RETURNING *",
    [name, email, age]
  );

  res.json(newStudent.rows[0]);
});

/* DELETE STUDENT */

app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM students WHERE id=$1", [id]);

  res.json("Deleted");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});