const express = require("express");
const router = express.Router();
const fs = require ("fs");
const appts = require("../data/appointments.json")
const meds =require("../data/medications.json")
const refs = require("../data/referrals.json")
const port = process.env.PORT || process.argv[2] || 8080


//middleware to check request body

const requestValid = (req, res, next) =>  {
  const inputValues = Object.values(req.body);
  const inputKeys = Object.keys(req.body);

  const reqFields = [
    "provider",
    "reason",
    "details",
    "date",
  ];

  if (
    reqFields.map((value) => inputKeys.includes(value)).includes(false)
  ) {
    return res.status(400).json({
      error: "Missing required properties.",
    });
  }
    //check if every value is truthy
  if (!inputValues.every((value) => !!value)) {
    return res.status(400).json({
      error: "Missing required properties.",
    });
  }
// Validate date format (M/D/YYYY)
const date = req.body.date;
const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;

if (!dateRegex.test(date)) {
  return res.status(400).json({
    error: "Invalid date format. Expected format: M/D/YYYY.",
  });
}

next();
};




// get all appointments in a list
router.get("/history/appointments", (req, res) => {
    res.json(appts);

    // console.log(appts)
  });

  // get single appointment
  router.get('/history/appointments/:id', (req,res) => {
    const found = appts.find((element) => element.id == req.params.id);
    console.log(req.params.id)
    res.json(found);
  })

  //PUT for single appointment
  router.put('/history/appointments/:id', requestValid, async(req,res) => {
    const update= req.body;
    const{id} = req.params;

    if (req.body.id) {
      return res.status(400).json({ message: `You cannot update this id.` });
    }
    
  });

  

  router.get("/history/medications", (req, res) => {
    res.json(meds);
    console.log(meds)
  })

  router.get("/referrals", (req, res) => {
    res.json(refs);
    console.log(refs)
  })

  

  module.exports = router;