const express = require('express');
const router = express.Router();
const Pendingreview = require('../models/pendingReview');
const UpcomingTrips = require('../models/upcomingTrips');
// const Mytrips = require('../models/myTrips')

router.route('/')
    //move a trip from upcoming to completed once the trip is completed
    .post(function (req, res) {
        let pendingreview = new Pendingreview();
        const query = { _id: req.body._id }
        pendingreview.tripDetails = req.body.tripDetails,
        pendingreview.user = req.body.user
        pendingreview.save((err, response) => err ? res.send(err) :
        UpcomingTrips.deleteOne(query, err => err ? res.send(err) : res.send(response._id)))

        // let myTrip = new Mytrips();
        // myTrip.name = req.body.name
        // myTrip.title = req.body.title
        // myTrip.views = req.body.views
        // myTrip.latitude = req.body.latitude
        // myTrip.longitude = req.body.longitude
        // myTrip.images = req.body.images
        // myTrip.blog = req.body.blog
        // myTrip.userId = req.body.userId
        // myTrip.userName = req.body.userName
        // myTrip.save((err, response) => err ? res.send(err) : res.send(response));
    });

module.exports = router