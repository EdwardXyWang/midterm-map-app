"use strict";

const express = require('express');
const router  = express.Router();

const bodyParser  = require("body-parser");

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("maps")
      .then((results) => {
        res.json(results);
    });
  });

  // return all points and title for a specific map
  router.get("/:map_id", (req, res) => {
    knex
      .select("*")
      .from("points")
      .innerJoin("maps", "points.map_id", "maps.id")
      .where("points.map_id", req.params.map_id)
      .then((results) => {
        res.json(results);
    });
  });

  // return all info for one selected point
  router.get("/:map_id/:point_id", (req, res) => {
    knex
      .select("*")
      .from("points")
      .where("id", req.params.point_id)
      .then((results) => {
        res.json(results);
    });
  });

  // create a new empty map object with given title
  router.post("/", (req, res) => {
    knex("maps")
      .insert({
        map_title: req.body.map_title,
        created_by: req.session.user_id
    });
  });

  // create a new point associated with this map_id
  router.post("/:map_id", (req, res) => {
    knex("points")
      .insert({
        lat: req.body.lat,
        long: req.body.long,
        description: req.body.description,
        image: req.body.image,
        point_title: req.body.title,
        map_id: req.params.map_id,
        created_by: req.session.user_id
    }).then((results) => {
      console.log("inserted!");
      res.status(200).send();
    });
  });

  // router.delete(), delete a specific map by map_id
  router.post("/:map_id/delete", (req, res) => {
    knex("maps")
      .where("id", req.params.map_id)
      .del();
  });

  // router.put(), update a specific point
  router.post("/:map_id/:point_id", (req, res) => {
    knex("points")
      .where("id", req.params.point_id)
      .update({
        lat: req.body.lat,
        long: req.body.long,
        description: req.body.description,
        image: req.body.image,
        point_title: req.body.title,
        map_id: req.params.map_id
    });
  });

  // router.delete(), delete a specific point by point_id
  router.post("/:map_id/:point_id/delete", (req, res) => {
    knex("points")
      .where("id", req.params.point_id)
      .del();
  });

  return router;
}
