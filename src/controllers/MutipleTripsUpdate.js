const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.route('/:tripsArray')
    //update multiple trips at once using array of tripId
    .patch((req, res) => {
        const query = { _id : { $in: JSON.parse(req.params.tripsArray) } }
        Trip.update(query, { $set: req.body }, { multi : true } , err => err ? res.send(err) : res.json({ message: "trips data updated" }))
    })

    //to get multiple trips at once using array of tripId
    .get((req, res) => {
        const query = { _id : { $in: JSON.parse(req.params.tripsArray) } }
        Trip.find(query, (err,trips) => err ? res.send(err) : res.send(trips))
    });

module.exports = router