const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');

router.route('/:tripid')
    //to get details of a trip by tripId
    .get(function (req, res) {
        var query = {
            _id: req.params.tripid
        };
        Trip.find(query, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    })

    //to delete a trip by tripId
    .delete(function (req, res) {
        var query = {
            _id: req.params.tripid
        };
        Trip.deleteOne(query, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({message:"trip deleted succesfully"})
        });
    })
    
    //to edit a trip by tripId
    .patch(function (req, res) {
        var query = {
            _id: req.params.tripid
        };
        Trip.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "trip data updated" })
        });
    });

    module.exports = router