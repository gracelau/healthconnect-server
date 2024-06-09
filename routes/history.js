const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require('path');
const meds = require("../data/medications.json")
const refs = require("../data/referrals.json")
const port = process.env.PORT || process.argv[2] || 8080;
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/appointments.json');
//middleware to check request body

const requestValid = (req, res, next) => {
  const inputValues = Object.values(req.body);
  const inputKeys = Object.keys(req.body);

  const reqFields = [
    "Provider",
    "Reason",
    "details",
    "timestamp",
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
  next();
};

function getAppts() {
  return JSON.parse(fs.readFileSync(dataPath, { encoding: "utf8" })); 
}

// get all appointments in a list
router.get("/history/appointments", (req, res) => {
  res.json(getAppts());
});

// get single appointment
router.get('/history/appointments/:id', (req, res) => {
  const appts = getAppts();
  const found = appts.find((element) => element.id == req.params.id);
  //console.log(req.params.id)
  res.json(found);
})

//PUT for single appointment (Edit)

router.put('/history/appointments/:id', requestValid, async (req, res) => {
  const update = req.body;
  const { id } = req.params;

  if (req.body.id) {
    return res.status(400).json({ message: `You cannot update this id.` });
  }
  try {
    const appointments = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const index = appointments.findIndex((a) => a.id === id);

    // return an error if the id was not found
    if (index === -1) {
      return res.status(404).json({
        message: `Warehouse with ID ${id} not found`,
      });
    }

    appointments[index] = { ...appointments[index], ...update };
    fs.writeFileSync(dataPath, JSON.stringify(appointments, null, 2), 'utf-8');

    res.status(200).json(appointments[index]);
  } catch (err) {
    console.error('PUT request to /history/appointments/:id failed: ', err);
    res.status(500).json({
      message: 'Internal server error',
    });
  }

});

//POST -  Add New Appointment 
router.post('/history/appointments/', (req, res) => {
  const { provider, reason, details, timestamp } = req.body;
  const appointments = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const id= uuidv4();

  const newAppt= {
    id: id,
    Provider:provider,
    Reason:reason,
    details,
    timestamp,
  };
  appointments.push(newAppt);
  fs.writeFileSync(dataPath, JSON.stringify(appointments, null, 2), 'utf-8');
  res.json(appointments); 

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

