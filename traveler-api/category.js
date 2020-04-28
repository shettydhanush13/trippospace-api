const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');

router.route('/:category')
    //to get details of a trip by tipId
    .get(function (req, res) {
        console.log("hello world",req)
        Trip.find({ tags: { $all: [req.params.category] }, isActive : true }, function (err, trip) {
            if (err) {
                res.send(err)
            }
            let city = ["ALL"]
            for (let i = 0; i < trip.length; i++) {
                city.push(trip[i].booking.departureCity)
            }
            var city1 = [...new Set(city)]
            if (req.query.departure === "ALL") {
                res.json({
                    trips: trip,
                    search: city1,
                    selected: "ALL"
                })
            } else {
                res.json({
                    trips: trip.filter(ele => ele.booking.departureCity === req.query.departure),
                    search: city1,
                    selected: req.query.departure
                })
            }
        });
    })

module.exports = router