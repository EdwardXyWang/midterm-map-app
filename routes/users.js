"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // get all users for testing
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  // render user profile page
  router.get("/:userid", (req, res) => {

  });

  // return list of user's favourites
  router.get("/:userid/favourites", (req, res) => {

  });

  // toggle existence of user/map favourite
  router.post("/:userid/favourites", (req, res) => {

  });

  return router;
}
