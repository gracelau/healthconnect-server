const express = require('express');
const app = express();
const cors = require("cors");
const historyRoutes = require("./routes/history.js");
require("dotenv").config();


// middleware
app.use(cors());
app.use(express.json());



app.use("/history/appointments", historyRoutes);


app.get('/', (req, res) => {
    // send some text back as a response
    res.send('Express is running!');
});


// start Express on port 8080
app.listen(8080, () => {
    console.log('Server Started on http://localhost:8080');

});