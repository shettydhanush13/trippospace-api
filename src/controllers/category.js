const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');
const Category = require('../models/category')

router.route('/')
    .get((req, res) => {
        Category.find({}, (err, category) => err ? res.send(err) : res.send(category)) 
    });

router.route('/:category')
    //to get details of a trip by tipId
    .get((req, res) => {
        const query = { tags: { $all: [req.params.category] }, isActive : true }
        Trip.find(query, (err, trip) => {
            if (err) {
                res.send(err)
            }
            let city = ["ALL"]
            for (let i = 0; i < trip.length; i++) {
                city.push(trip[i].booking.departureCity)
            }
            let uniqueCity = [...new Set(city)]
            if (req.query.departure === "ALL") {
                res.json({
                    trips: trip,
                    search: uniqueCity,
                    selected: "ALL"
                })
            } else {
                res.json({
                    trips: trip.filter(ele => ele.booking.departureCity === req.query.departure),
                    search: uniqueCity,
                    selected: req.query.departure
                })
            }
        });
    })

module.exports = router