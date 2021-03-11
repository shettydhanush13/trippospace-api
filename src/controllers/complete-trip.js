const express = require('express');
const router = express.Router();
const Pendingreview = require('../models/pendingReview');
const UpcomingTrips = require('../models/upcomingTrips');
const Mytrips = require('../models/myTrips')

router.route('/')
    //move a trip from upcoming to completed once the trip is completed
    .post(async (req, res) => {
        let pendingreview = new Pendingreview();
        const query = { _id: req.body._id }
        pendingreview.tripDetails = req.body.tripDetails,
        pendingreview.user = req.body.user
        await pendingreview.save()
        await UpcomingTrips.deleteOne(query)

        let myTrip = new Mytrips();
        myTrip.name = req.body.name
        myTrip.title = req.body.title
        myTrip.views = req.body.views
        myTrip.latitude = req.body.latitude
        myTrip.longitude = req.body.longitude
        myTrip.images = req.body.images
        myTrip.date = req.body.date
        myTrip.blog = req.body.blog
        myTrip.userId = req.body.user
        myTrip.userName = req.body.userName
        myTrip.save((err) => err ? res.send(err) : res.send(""));
    });

router.route('/:userId')
    //to get trip detail by tripId
    .get((req, res) => {
        const query = { userId : req.params.userId }
        Mytrips.find(query, (err, trip) => err ? res.send(err) : res.json({ trips : trip.length}))
    });

module.exports = router