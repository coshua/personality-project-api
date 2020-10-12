const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const port = process.env.PORT || 3000;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: "admin",
  password: process.env.MYSQL_PASSWORD,
  port: "3306",
  database: "personality",
});
db.connect();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

var queryStat = `SELECT SUM(CASE WHEN category = "ISTJ" THEN 1 ELSE 0 END) AS "ISTJ",
SUM(CASE WHEN category = "ISTP" THEN 1 ELSE 0 END) AS "ISTP",
SUM(CASE WHEN category = "ISFJ" THEN 1 ELSE 0 END) AS "ISFJ",
SUM(CASE WHEN category = "ISFP" THEN 1 ELSE 0 END) AS "ISFP",
SUM(CASE WHEN category = "INFJ" THEN 1 ELSE 0 END) AS "INFJ",
SUM(CASE WHEN category = "INFP" THEN 1 ELSE 0 END) AS "INFP",
SUM(CASE WHEN category = "INTJ" THEN 1 ELSE 0 END) AS "INTJ",
SUM(CASE WHEN category = "INTP" THEN 1 ELSE 0 END) AS "INTP",
SUM(CASE WHEN category = "ESTP" THEN 1 ELSE 0 END) AS "ESTP",
SUM(CASE WHEN category = "ESTJ" THEN 1 ELSE 0 END) AS "ESTJ",
SUM(CASE WHEN category = "ESFP" THEN 1 ELSE 0 END) AS "ESFP",
SUM(CASE WHEN category = "ESFJ" THEN 1 ELSE 0 END) AS "ESFJ",
SUM(CASE WHEN category = "ENFP" THEN 1 ELSE 0 END) AS "ENFP",
SUM(CASE WHEN category = "ENFJ" THEN 1 ELSE 0 END) AS "ENFJ",
SUM(CASE WHEN category = "ENTP" THEN 1 ELSE 0 END) AS "ENTP",
SUM(CASE WHEN category = "ENTJ" THEN 1 ELSE 0 END) AS "ENTJ" FROM result`;
app.get("/api/result", (req, res) => {
  db.query(queryStat, (err, results) => {
    res.send(results);
  });
});

app.post("/api/result", (req, res) => {
  try {
    db.query(
      "INSERT INTO result(response, category, created) VALUES(?,?,DEFAULT)",
      [req.body.response, req.body.category],
      (err, results) => {
        if (err) throw err;
        res.end();
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/index.html", (req, res) => {
  res.status(200).send("Index.html");
});

app.get("/ping.html", (req, res) => {
  res.status(200).send("ping.html");
});

app.get("/", (req, res) => {
  res.status(200).send("Hi");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
