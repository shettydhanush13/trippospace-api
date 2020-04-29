const express = require('express');
const router = express.Router();
const Pendingreview = require('../app/models/pendingReview');
const UpcomingTrips = require('../app/models/upcomingTrips');

router.route('/')
    //move a trip from upcoming to completed once the trip is completed
    .post(function (req, res) {
        let pendingreview = new Pendingreview();
        const query = { _id: req.body._id }
        pendingreview.tripDetails = req.body.tripDetails,
        pendingreview.user = req.body.user
        pendingreview.save((err, response) => err ? res.send(err) :
        UpcomingTrips.deleteOne(query, err => err ? res.send(err) : res.send(response._id)))
    });

module.exports = router