const express = require('express');
const router = express.Router();
const Organizerstats = require('../models/organizerstats');
const {config} = require('../config')
const { trips, stats } = require('../static/stats')

router.route('/')
    //to get completed trip stats
    .get((req, res) => {
        Organizerstats.find({},{ trips : 0, organizerName : 0, organizerId :0, _id : 0 }, (err, data) => err ? res.send(err) : res.send(data))
    });

router.route('/')
    //to get completed trip stats
    .post(async (req, res) => {
        const { organizerName, organizerId } = req.body
        let statData = await Organizerstats.find({ organizerName, organizerId })
        if(statData.length === 0){
            let organizerstats = new Organizerstats();
            organizerstats.organizerName = req.body.organizerName;
            organizerstats.organizerId = req.body.organizerId;
            organizerstats.trips = trips;
            organizerstats.stats = stats;
            organizerstats.save((err, response) => err ? res.send(err) : res.send({message : "stat added succesfully"}));
        } else {
            Organizerstats.findOneAndUpdate({ organizerName, organizerId }, { $set : req.body}, (err, response) => err ? res.send(err) : res.send({message : "stat updated succesfully"}))
        }
    })

router.route('/reset/:organizerId')
    //to get completed trip stats
    .patch((req, res) => {
        let query = {organizerId : req.params.organizerId}
        let body = {
            trips,
            stats
        }
        Organizerstats.updateOne(query, { $set : body}, (err, response) => err ? res.send(err) : res.send(response));
    })

router.route('/:organizerId')
    //to get stats of organizer using organizerId
    .get(async (req, res) => {
        const query = { organizerId : req.params.organizerId }
        let stats = await Organizerstats.findOne(query)
        res.send({data : stats, commission : config.organizerCommissions[req.params.organizerId].commission })
    })

    .patch((req, res) => {
        const query = { organizerId : req.params.organizerId }
        Organizerstats.updateOne(query, {$set : req.body}, (err, data) => err ? res.send(err) : res.send(data))
    })

module.exports = router