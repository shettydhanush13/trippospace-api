const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');
const Places = require('../app/models/places');

router.route('/')
    //to get all places data
    .get((req, res) => {
        Places.find({}, (err, place) => err ? res.send(err) : res.send(place))
    });

router.route('/placesByMonth/:month')
    //to get all places to visit in a month
    .get((req, res) => {
        const query = { months: { $all: [req.params.month] } }
        Places.find(query, (err, places) => err ? res.send(err) : res.send(places))
    });

router.route('/trendingPlacesByMonth/:month')
    //to get 6 trending places to visit in a month
    .get((req, res) => {
        const shuffle = array => array.sort(() => Math.random() - 0.5);
        const query = { months: { $all: [req.params.month] } }
        Places.find(query, (err, places) => err ? res.send(err) : res.send(shuffle(places).slice(0, 6)))
    });

router.route('/explore/:place')
    //to get place details using place name
    .get((req, res) => {
        const query = { title: req.params.place }
        Places.find(query, (err, place) => err ? res.send(err) : res.send(place)).limit(1)
    });
    
router.route('/mutiplePlaces')
    //to get details of multiple trips by ids
    .post(function (req, res) {
        const query = { title : { $in: req.body.places } }
        Places.find(query, (err, place) => err ? res.send(err) : res.send(place))
    });

router.route('/:name')
    //to get all trips to a place by place name
    .get((req, res) => {
        const query = { place: { $all: [req.params.name] }, isActive : true }
        Trip.find(query, (err, trip) => {
            if (err) {
                res.send(err)
            } else {
                let city = ["ALL"]
                for (let i = 0; i < trip.length; i++) {
                    city.push(trip[i].booking.departureCity)
                }
                let uniqueCityList = [...new Set(city)]
                if (req.query.departure === "ALL") {
                    res.json({
                        trips: trip,
                        search: uniqueCityList,
                        selected: "ALL"
                    })
                } else {
                    res.json({
                        trips: trip.filter(ele => ele.booking.departureCity === req.query.departure),
                        search: uniqueCityList,
                        selected: req.query.departure
                    })
                }
            }
        })
    });

module.exports = router

