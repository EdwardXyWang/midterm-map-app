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
  router.get("/:user_id", (req, res) => {
    res.render("user");
  });

  // return list of user's favourites
  router.get("/:user_id/favourites", (req, res) => {
    knex
      .select("map_id")
      .from("favourites")
      .where("user_id", req.session.user_id)
      .then((results) => {
        res.json(results);
    });
  });

  // toggle existence of user/map favourite
  router.post("/:user_id/favourites", (req, res) => {
    knex
      .select("*")
      .from("favourites")
      .where("user_id", req.params.user_id).andWhere("map_id", req.body.map_id)
      .then((results) => {
        console.log(results);
    });
  });

  return router;
}
