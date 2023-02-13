const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.route('/:place')
    //to get details of trips depatrting from a particular city
    .get((req, res) => {
        const query = { "booking.departureCity": req.params.place }
        Trip.find(query, (err, trips) => err ? res.send(err) : res.send(trips))
    })

module.exports = router