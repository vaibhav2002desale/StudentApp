const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

/* CORS FIX */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://moonlit-swan-8190a9.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/* GET STUDENTS */
app.get("/students", async (req, res) => {
  try {
    const students = await pool.query("SELECT * FROM students");
    res.json(students.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
/* ADD STUDENT */
app.post("/students", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const newStudent = await pool.query(
      "INSERT INTO students (name,email,age) VALUES ($1,$2,$3) RETURNING *",
      [name, email, age]
    );

    res.json(newStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* DELETE STUDENT */
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM students WHERE id=$1", [id]);

    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* PORT FIX FOR RENDER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});