const express = require('express');
const router = express.Router();
const UpcomingTrips = require('../app/models/upcomingTrips');

router.route('/:userId')
    //to get upcoming trips by user Id
    .get((req, res) => {
        const query = { userId : req.params.userId }
        UpcomingTrips.find(query, (err, trips) => err ? res.send(err) : res.send(trips))
    });

router.route('/:id')
    //edit upcoming trip
    .patch((req, res) => {
        const query = { _id :req.params.id }
        UpcomingTrips.update(query, { $set : req.body }, (err, trip) => err ? res.send(err) : res.send(trip))
    });

router.route('/')
    //add a trip to upcoming trips
    .post((req, res) => {
        let upcomingtrips = new UpcomingTrips();
        upcomingtrips.tripTitle = req.body.tripTitle;
        upcomingtrips.thumb = req.body.thumb;
        upcomingtrips.tripId = req.body.tripId
        upcomingtrips.travelers = req.body.travelers
        upcomingtrips.credits = req.body.credits
        upcomingtrips.date = req.body.date
        upcomingtrips.days = req.body.days
        upcomingtrips.userId = req.body.userId
        upcomingtrips.travelers = req.body.travelers,
        upcomingtrips.price = req.body.price
        upcomingtrips.save((err, response) => err ? res.send(err) : res.send(response))
    })

router.route('/check-upcoming-trip')
    .get((req, res) => {
        const query = { userId : req.query.u, tripId:req.query.t }
        UpcomingTrips.find(query, (err, trip) => err ? res.send(err) : trip === null ? res.send(false) : res.send(trip))
});

module.exports = router