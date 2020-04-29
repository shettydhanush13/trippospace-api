const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');
const Customer = require('../app/models/customers')

router.route('/')
    //add customer to a trip
    .post((req, res) => {
        let customer = new Customer();
        customer.name = req.body.name;
        customer.mail = req.body.mail;
        customer.phone = req.body.phone;
        customer.organizer = req.body.organier;
        customer.source = req.body.source;
        customer.save((err,response) => err ? res.send(err) : res.json({ id : response }))
    });

router.route('/:tripId')
    //get customers for a trip using tripId
    .get((req, res) => {
        const query = { _id: req.params.tripId }
        Trip.find(query, (err, trip) => err ? res.send(err) : res.json({ customers : trip[0].booking.customerList }))
    })

    //update customer list of a trip
    .patch((req, res) => {
        const query = { _id: req.params.tripId }
        Trip.updateOne(query, { $set: req.body }, err => err ? res.send(err) : res.json({ message: "customer list updated" }))
    });

module.exports = router