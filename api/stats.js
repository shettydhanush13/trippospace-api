const express = require('express');
const router = express.Router();
const Organizerstats = require('../app/models/organizerstats');

router.route('/')
    //to get completed trip stats
    .get(function (req, res) {
        Organizerstats.find({},{ trips : 0, organizerName : 0, organizerId :0, _id : 0 }, (err, data) => err ? res.send(err) : res.send(data))
    });

router.route('/:organizerId')
    //to get stats of organizer using organizerId
    .get((req, res) => {
        const query = { organizerId : req.params.organizerId }
        Organizerstats.findOne(query, (err, data) => err ? res.send(err) : res.send(data))
    })

    .patch((req, res) => {
        const query = { organizerId : req.params.organizerId }
        Organizerstats.updateOne(query, {$set : req.body}, (err, data) => err ? res.send(err) : res.send(data))
    })

module.exports = router