"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("maps")
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/maps", (req, res) => {

  });

  router.get("/maps/:mapid", (req, res) => {

  });

  router.get("/maps/:mapid/:pointid", (req, res) => {

  });

  router.post("/maps", (req, res) => {

  });

  router.post("/maps/:mapid", (req, res) => {

  });

  // router.delete()
  router.post("/maps/:mapid/delete", (req, res) => {

  });

  // router.put()
  router.post("/maps/:mapid/:pointid", (req, res) => {

  });

  // router.delete()
  router.post("/maps/:mapid/:pointid/delete", (req, res) => {

  });

  return router;
}
