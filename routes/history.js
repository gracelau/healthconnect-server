const express = require("express");
const router = express.Router();
const fs = require ("fs");
const appts = require("../data/appointments.json")
const port = process.env.PORT || process.argv[2] || 8080

// get all history, a collection/array
router.get("/", (req, res) => {
    res.json(appts);

    console.log(appts)
  });

  module.exports = router;