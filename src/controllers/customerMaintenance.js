const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');
const Customer = require('../models/customers')

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
    })

    //update customer list of a trip
    .delete((req, res) => {
        let { partial, bookingId, slots } = req.body
        let { tripId } = req.params
        let query = partial ? { tripId, "booking.customerList.bookingId" : bookingId } : { tripId }
        let updatequery = partial ? 
        { $set : {"booking.customerList.$.slots" : slots }}
        :
        { $pull : {"booking.customerList" : { bookingId }}}
        Trip.updateOne(query, updatequery, (err,data) => err ? res.send(err) : res.json(data))
    });

module.exports = router