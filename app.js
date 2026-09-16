const path = require("path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.connectionString,
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO USERS (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch (error) {
    return next(error);
  }
});

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app is listening on port 3000...");
});
