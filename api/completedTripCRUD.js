const express = require('express');
const router = express.Router();
const Mytrips = require('../app/models/myTrips');

router.route('/')
    //to post a new completed trip
    .post((req, res) => {
        let myTrip = new Mytrips();
        myTrip.name = req.body.name
        myTrip.title = req.body.title
        myTrip.views = req.body.views
        myTrip.latitude = req.body.latitude
        myTrip.longitude = req.body.longitude
        myTrip.images = req.body.images
        myTrip.blog = req.body.blog
        myTrip.userId = req.body.userId
        myTrip.userName = req.body.userName
        myTrip.save((err, response) => err ? res.send(err) : res.send(response));
    })

    //to get all completed trips
    .get((req, res) => {
        Mytrips.find({},(err, trips) => err ? res.send(err) : res.send(trips));
    });

router.route('/:user')
    //to get all completed trips for a user by userId
    .get((req, res) => {
        const query = { userId : req.params.user }
        Mytrips.find(query, (err, trips) => err ? res.send(err) : res.send(trips));
    });

router.route('/:id')
    //to update completed trip data using tripId
    .patch((req, res) => {
        const query = { _id : req.params.id };
        Mytrips.updateOne(query, { $set: req.body }, (err) => err ? res.send(err) : res.json({ message: "trip details updated" }));
    })

    .delete(function (req, res) {
        const query = { _id : req.params.id };
        Mytrips.deleteOne(query, (err) => err ? res.send(err) : res.json({ message: "trip deleted successfully" }));
    });

module.exports = router