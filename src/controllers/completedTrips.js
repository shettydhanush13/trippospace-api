const express = require('express');
const router = express.Router();
const Tripreviews = require('../models/tripReview');

router.route('/:tripId')
    //to get trip detail by tripId
    .get((req, res) => {
        const query = { _id :req.params.tripId }
        Tripreviews.findOne(query, (err, trip) => err ? res.send(err) : res.send(trip))
    });

module.exports = router