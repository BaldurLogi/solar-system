const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

mongoose.connect(
    process.env.MONGO_URI,
  )
    .then(() => console.log("MongoDB Connection Successful"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

app.post('/planet', async (req, res) => {
    try {
      // findOne returns a promise in Mongoose 7
      const planetData = await planetModel.findOne({ id: req.body.id });

      if (!planetData) {
        // Instead of alert (which doesn't exist on the server),
        // respond with a 404 or custom message:
        return res.status(404).send("Planet not found. Select a number from 0 - 9");
      }

      // If found, send the planet data
      return res.json(planetData);
    } catch (err) {
      // Handle any errors that occurred during lookup
      console.error("Error fetching planet data:", err);
      return res.status(500).send("Error fetching planet data");
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      "os": OS.hostname(),
      "env": process.env.NODE_ENV
    });
});

app.get('/live', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      "status": "live"
    });
});

app.get('/ready', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      "status": "ready"
    });
});

app.listen(3000, () => {
    console.log("Server successfully running on port 3000");
});

module.exports = app;
