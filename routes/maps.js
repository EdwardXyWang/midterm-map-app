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
    }).catch(function(err) {
        console.error(err);
      });
  });

  // return all points and title for a specific map
  router.get("/:map_id", (req, res) => {
    knex
      .select("users.first_name", "users.last_name", "points.id AS point_id", "point_title", "lat", "long", "maps.id AS map_id")
      .from("users")
      .join("maps", "users.id", "maps.created_by")
      .leftOuterJoin("points", "maps.id", "map_id")
      .where("maps.id", req.params.map_id)
      .orderBy("points.id")
      .then((results) => {
        res.json(results);
    }).catch(function(err) {
        console.error(err);
      });
  });

  // return all info for one selected point
  router.get("/points/:point_id", (req, res) => {
    knex
      .select("description", "lat", "long", "image", "point_title", "first_name", "last_name", "points.id AS point_id")
      .from("users")
      .join("maps", "users.id", "maps.created_by")
      .join("points", "maps.id", "map_id")
      .where("points.id", req.params.point_id)
      .then((results) => {
        res.json(results);
    }).catch(function(err) {
        console.error(err);
      });
  });

  // create a new empty map object with given title
  router.post("/", (req, res) => {
    knex("maps")
    .returning('id')
    .insert({
      map_title: req.body.map_title,
      created_by: req.session.user_id
    }).then((results) => {
      res.json(results);
    }).catch(function(err) {
        console.error(err);
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
    }).catch(function(err) {
        console.error(err);
      });
  });

  // router.delete(), delete a specific map by map_id
  router.post("/:map_id/delete", (req, res) => {
    knex("maps")
      .where("id", req.params.map_id)
      .del();
  });

  // router.put(), update a specific point
  router.post("/points/:point_id", (req, res) => {
    knex("points")
      .where("id", req.params.point_id)
      .update({
        lat: req.body.lat,
        long: req.body.long,
        description: req.body.description,
        image: req.body.image,
        point_title: req.body.title,
        map_id: req.params.map_id
    }).then((results) => {
      console.log("updated!");
      res.status(200).send();
    }).catch(function(err) {
        console.error(err);
      });
  });

  // router.delete(), delete a specific point by point_id
  router.post("/points/:point_id/delete", (req, res) => {
    knex("points")
      .where("id", req.params.point_id)
      .del().then(() => {
        console.log("Point deleted!");
        res.status(200).send();
      }).catch(function(err) {
        console.error(err);
      });
  });

  return router;
}
