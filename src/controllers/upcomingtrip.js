const express = require('express');
const router = express.Router();
const UpcomingTrips = require('../models/upcomingTrips');

// router.route('/checkUpcomingTrip')
//     .post((req, res) => {
//         const query = { userId : req.body.u, tripId:req.query.t }
//         console.log("query : ",query,req.query)
//         UpcomingTrips.find(query, (err, trip) => err ? res.send(err) : trip === null ? res.send(false) : res.send(trip))
// });

router.route('/:userId')
    //to get upcoming trips by user Id
    .get((req, res) => {
        const query = { userId : req.params.userId, travelers : { $gt: 0 } }
        UpcomingTrips.find(query, (err, trips) => err ? res.send(err) : res.send(trips))
    });

    
router.route('/trip/:tripId')
//to get upcoming trips by user Id
    .get((req, res) => {
        const query = { _id : req.params.tripId }
        UpcomingTrips.findOne(query, (err, trips) => err ? res.send(err) : res.send(trips))
    });

router.route('/:id')
    //edit upcoming trip
    .patch((req, res) => {
        const query = { _id : req.params.id }
        UpcomingTrips.updateOne(query, { $set : req.body }, (err, trip) => err ? res.send(err) : res.send(trip))
    });

router.route('/whatsappLink/:tripId')
    //edit upcoming trip
    .get((req, res) => {
        const query = { tripId : req.params.tripId }
        UpcomingTrips.findOne(query, (err, trip) => err ? res.send(err) : res.send(trip ? trip.whatsappLink : ""))
    });

router.route('/edit/:tripId')
    //edit upcoming trip
    .patch((req, res) => {
        const query = { tripId : req.params.tripId }
        UpcomingTrips.updateMany(query, { $set : req.body }, (err, trip) => err ? res.send(err) : res.send(trip))
    });

router.route('/')
    //add a trip to upcoming trips
    .post((req, res) => {
        let bookingId = ""
        const shuffleArray = array => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array
        }
        const generateBookingId = () => {
            let id = `${req.body.userId}${req.body.tripId}${req.body.date}`
            return shuffleArray(id.split("")).slice(0,12).join("")
        }
        bookingId = generateBookingId()
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
        upcomingtrips.price = req.body.price,
        upcomingtrips.paid = req.body.paid,
        upcomingtrips.pending = req.body.pending,
        upcomingtrips.bookingId = bookingId
        upcomingtrips.transactionId = req.body.transactionId
        upcomingtrips.organizerId = req.body.organizerId
        upcomingtrips.whatsappLink = ""
        upcomingtrips.save((err) => err ? res.send(err) : res.json({ bookingId }))
    });

module.exports = router