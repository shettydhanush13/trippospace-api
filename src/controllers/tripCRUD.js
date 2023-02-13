const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.route('/')
    //to post a new trip
    .post((req, res) => {
        const shuffleArray = array => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array
        }
        const generateTripId = () => {
            let id = `${req.body.title}${req.body.organizerId}${req.body.date}`.replace(/ /g,"").replace(/-/g,"")
            return shuffleArray(id.split("")).slice(0,12).join("")
        }
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
        trip.tripId = generateTripId()
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
        const query = { _id: req.params.tripid };
        Trip.findOne(query, (err, trip) => err ? res.send(err) : res.send(trip));
    })

    //to delete a trip by tripId
    .delete((req, res) => {
        const query = { _id: req.params.tripid };
        Trip.deleteOne(query, err => err ? res.send(err) :  res.json({message:"trip deleted succesfully"}))
    })
    
    //to edit a trip by tripId
    .patch((req, res) => {
        const query = { tripId: req.params.tripid };
        Trip.updateOne(query, { $set: req.body }, err => err ? res.send(err) : res.json({ message: "trip data updated" }))
    });

router.route('/id/:tripid')
    //to get details of a trip by tripId
    .get((req, res) => {
        const query = { tripId: req.params.tripid };
        Trip.findOne(query, (err, trip) => err ? res.send(err) : res.send(trip));
    });

router.route('/includes/:place')
    //to get details of a trip by tripId
    .get(async (req, res) => {
        const { budget, type, nights, price } = req.query
        let n = JSON.parse(nights).sort()
        let b = JSON.parse(budget).sort()
        let ltNights = 0
        let gtNights = 100
        let ltBudget = 0
        let gtBudget = 10000000
        if(n.length > 0){
            gtNights = Number(n[n.length-1].split("-")[1])
            ltNights = Number(n[0].split("-")[0])
        }
        if(b.length > 0){
            gtBudget = Number(b[b.length-1].split("-")[1])
            ltBudget = Number(b[0].split("-")[0])
        }
        console.log(gtBudget, ltBudget)

        if(req.params.place.includes("category-")) {
            let query = { tags : { $all : req.params.place.split("category-")[1]}, "tripTypes.value" : { $lte : gtBudget, $gte : ltBudget }, "booking.days" : { $lte : gtNights, $gte : ltNights } }
            const trips = await Trip.find(query).sort({'booking.lowestPrice': (price === "a") ? 1 : -1});
            res.send(trips)
        } else {
            Trip.aggregate([
                // Match first to reduce documents to those where the array contains the match
                { "$match": {
                    "place": { "$regex": req.params.place, "$options": "i" }
                }},
        
                // Unwind to "de-normalize" the document per array element
                { "$unwind": "$place" },
        
                // Now filter those document for the elements that match
                { "$match": {
                    "place": { "$regex": req.params.place, "$options": "i" }
                }},
        
                // Group back as an array with only the matching elements
                { "$group": {
                    "_id": "$_id"
                }}
            ],
            (err,results) => {
                let idList = []
                for(let i=0; i<results.length; i++) idList.push(results[i]._id)
                const query = { _id: { $in : idList },"tripTypes.value" : { $lte : gtBudget, $gte : ltBudget }, "booking.days" : { $lte : gtNights, $gte : ltNights } };
                Trip.find(query, (err, trip) => err ? res.send(err) : res.send(trip)).sort({'booking.lowestPrice': (price === "a") ? 1 : -1});
            })
        }
    });

module.exports = router