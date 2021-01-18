const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.route('/:organizerId')
    //get bookmarked trips of an organizer using organizerId
    .get((req, res) => {
        const query = { isFav : true, isActive : true,  organizerId : req.params.organizerId }
        Trip.find(query, (err,trip) => err ? res.send(err) : res.send(trip));
    })


router.route('/:tripId')
    //bookmark or unbookmark a trip using tripId
    .patch((req, res) => {
        const query = { _id: req.params.tripId };
        Trip.updateOne(query, { $set: req.body }, err => err ? res.send(err) : res.json({ message: "bookmark status updated" }));
    })

module.exports = router