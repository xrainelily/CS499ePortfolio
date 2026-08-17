const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - list all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).exec();

    return res.status(200).json(trips);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.find({ code: req.params.tripCode }).exec();

    if (!trip || trip.length === 0) {
      return res.status(404).json({ message: "trip not found" });
    }

    return res.status(200).json(trip); 
  } catch (err) {
    return res.status(500).json(err);
  }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async(req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();
        if(!q)
        {
            return res
                .status(400)
                .json(q);
        } else {
            return res 
                .status(201)
                .json(q);
        }
};

// PUT: /trips/:tripCode - Update a Trip
// Response includes HTTP status code and JSON result
const tripsUpdateTrip = async (req, res) => {

  // Debug
  console.log(req.params);
  console.log(req.body);

  try {
    const q = await Model.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true } // returns updated document
    ).exec();

    if (!q) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.status(200).json(q);

  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};