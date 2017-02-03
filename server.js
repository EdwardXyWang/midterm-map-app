"use strict";

require("dotenv").config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const cookieSession = require("cookie-session");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require("morgan");
const knexLogger  = require("knex-logger");

// Seperated Routes for each Resource
const mapsRoutes = require("./routes/maps");
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// "dev" = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: "expanded"
}));

app.use(cookieSession({
  name: "session",
  keys: [process.env.SESSION_SECRET || 'development']
}))

app.use(express.static("public"));

// Check login status for all routes
app.use(function(req, res, next){
  res.locals.user_id = req.session.user_id || "";
  next();
});

// Mount all resource routes
app.use("/maps", mapsRoutes(knex));
app.use("/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index", { API_KEY : process.env.GOOGLE_API });
});

app.post("/login", (req, res) => {
  req.session.user_id = req.body.user_id;
  res.send();
});

app.get("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
