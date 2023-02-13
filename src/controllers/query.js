const express = require('express');
const router = express.Router();
const Query = require('../models/query');

router.route('/')
    .post((req,res) => {
        let query = new Query();
        query.trip = req.body.trip
        query.organizer = req.body.organizer
        query.user = req.body.user
        query.booking = req.body.booking
        query.pricing = req.body.pricing
        query.status = req.body.status
        query.payment = req.body.payment
        query.refund = req.body.refund
        query.save((err, response) => err ? res.send(err) : res.json(response))    
    })  
    
    .get((req,res) => {
        Query.find({} , (err, response) => err ? res.send(err) : res.json(response))    
    })

module.exports = router