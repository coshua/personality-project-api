const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
var http = require("http");
const port = process.env.PORT || 3000;

http
  .createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("Hello ELB - 1");
    response.end();
  })
  .listen(80);

dotenv.config();

var corsOptions = {
  origin: [
    "https://personality.jutopia.net/",
    /\.personality\.jutopia\.net$/,
    /\.jutopia\.net$/,
  ],
  methods: ["GET", "POST", "OPTIONs"],
  allowHeaders: "Content-Type",
  preflightContinue: true,
};

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
app.use(cors());
/* if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
} */

const filterReq = (header) => {
  if (header["sec-fetch-site"] == undefined) return false;
  if (
    header["sec-fetch-site"] == "same-origin" ||
    header["sec-fetch-site"] == "same-site"
  )
    return true;
  if (
    header["sec-fetch-mode"] == "cors" ||
    header["sec-fetch-mode"] == "same-origin"
  )
    return true;
  return false;
};

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
  if (filterReq(req.headers)) {
    db.query(queryStat, (err, results) => {
      res.send(results);
    });
  } else {
    res.status(401).send("Not Authorized");
  }
});

app.post("/api/result", (req, res) => {
  if (
    filterReq(req.headers) &&
    req.headers.origin === "https://personality.jutopia.net"
  ) {
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
  } else {
    res.status(401).send("Not Authorized");
  }
});

app.get("/", (req, res) => {
  res.status(200).send("10/16");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
