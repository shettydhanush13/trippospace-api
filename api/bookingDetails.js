const express = require('express');
const router = express.Router();
const BookingDetails = require('../app/models/bookingDetails');

router.route('/')
    //add item to cancel request list
    .post((req, res) => {
        let bookingDetails = new BookingDetails();
        bookingDetails.tripId = req.body.tripId
        bookingDetails.bookingId = req.body.bookingId
        bookingDetails.user = req.body.user
        bookingDetails.date = req.body.date
        bookingDetails.organizerId = req.body.organizerId
        bookingDetails.transactionId = req.body.transactionId
        bookingDetails.price = req.body.price
        bookingDetails.slots = req.body.slots
        bookingDetails.paid = req.body.paid
        bookingDetails.gift = req.body.gift
        bookingDetails.creditsReedeemed = req.body.creditsReedeemed
        bookingDetails.status = req.body.status
        bookingDetails.cancelled = req.body.cancelled
        bookingDetails.refunded = req.body.refunded
        bookingDetails.save((err) => err ? res.send(err) : res.send("booking details added succesfully"));
    })


router.route('/:bookingId')
    //get booking details by booking Id
    .get((req, res) => {
        const query = { bookingId: req.params.bookingId }
        BookingDetails.findOne(query, (err, item) => err ? res.send(err) : res.send(item));
    })


module.exports = router