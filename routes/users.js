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
    res.render("profile");
  });

  // return list of user's maps
  router.get("/:user_id/maps", (req, res) => {
    knex
      .select("map_title")
      .from("maps")
      .where("created_by", req.params.user_id)
      .then((results) => {
        res.json(results);
    });
  });

  // return list of maps that user has contributed to
  router.get("/:user_id/contributions", (req, res) => {
    knex("users")
      .join("points", "users.id", "points.created_by")
      .join("maps", "map_id", "maps.id")
      .distinct("map_title", "maps.id")
      .select()
      .where("points.created_by", req.params.user_id)
      .then((results) => {
        res.json(results);
    });
  });


  // return list of user's favourites
  router.get("/:user_id/favourites", (req, res) => {
    knex
      .select("map_id")
      .from("favourites")
      .where("user_id", req.params.user_id)
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
