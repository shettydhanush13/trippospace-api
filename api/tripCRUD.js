const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');

router.route('/')
    //to post a new trip
    .post((req, res) => {
        let trip = new Trip();
        trip.title = req.body.title;
        trip.destination = req.body.destination;
        trip.thumb = req.body.thumb;
        trip.isFav = req.body.isFav;
        trip.isActive = req.body.isActive;
        trip.description = req.body.description;
        trip.tags = req.body.tags;
        trip.images = req.body.images;
        trip.reviews = req.body.reviews;
        trip.place = req.body.place;
        trip.organizer = req.body.organizer;
        trip.booking = req.body.booking;
        trip.date = req.body.date;
        trip.partialPay = req.body.partialPay;
        trip.tripTypes = req.body.tripTypes;
        trip.itinerary = req.body.itinerary;
        trip.pickup = req.body.pickup;
        trip.inclusions = req.body.inclusions;
        trip.exclusions = req.body.exclusions;
        trip.credits = req.body.credits;
        trip.organizerId = req.body.organizerId;
        trip.organizerName = req.body.organizerName;
        trip.terms = req.body.terms;
        trip.cancellationPolicy = req.body.cancellationPolicy;
        trip.thingsToCarry = req.body.thingsToCarry;
        trip.notes = req.body.notes;
        trip.save((err, response) => err ? res.send(err) : res.send(response));
    })

    //to get details of all the trips
    .get((req, res) => {
        const query = { isActive: true };
        Trip.find(query, (err, trips) => err ? res.send(err) : res.send(trips));
    });

router.route('/:tripid')

    //to get details of a trip by tripId
    .get((req, res) => {
        var query = { _id: req.params.tripid };
        Trip.findOne(query, (err, trip) => err ? res.send(err) : res.send(trip));
    })

    //to delete a trip by tripId
    .delete((req, res) => {
        const query = { _id: req.params.tripid };
        Trip.deleteOne(query, err => err ? res.send(err) :  res.json({message:"trip deleted succesfully"}))
    })
    
    //to edit a trip by tripId
    .patch((req, res) => {
        const query = { _id: req.params.tripid };
        Trip.updateOne(query, { $set: req.body }, err => err ? res.send(err) : res.json({ message: "trip data updated" }))
    });

    

module.exports = router