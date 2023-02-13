const express = require('express');
const router = express.Router();
const BookingDetails = require('../models/bookingDetails');

router.route('/')
    //add item to cancel request list
    .post((req, res) => {
        let bookingDetails = new BookingDetails();
        bookingDetails.tripId = req.body.tripId
        bookingDetails.tripName = req.body.tripName
        bookingDetails.bookingId = req.body.bookingId
        bookingDetails.user = req.body.user
        bookingDetails.date = req.body.date
        bookingDetails.bookingDate = req.body.bookingDate
        bookingDetails.created_at = req.body.created_at,
        bookingDetails.organizerId = req.body.organizerId
        bookingDetails.transactionId = req.body.transactionId
        bookingDetails.grossPrice = req.body.grossPrice
        bookingDetails.price = req.body.price
        bookingDetails.slots = req.body.slots
        bookingDetails.paid = req.body.paid
        bookingDetails.netPaid = req.body.netPaid
        bookingDetails.pending = req.body.pending
        bookingDetails.gift = req.body.gift
        bookingDetails.creditsReedeemed = req.body.creditsReedeemed
        bookingDetails.status = req.body.status
        bookingDetails.cancelled = req.body.cancelled
        bookingDetails.refundPercentage = req.body.refundPercentage
        bookingDetails.refundAmount = req.body.refundAmount
        bookingDetails.refundCredits = req.body.refundCredits
        bookingDetails.pendingAfterCancellation = req.body.pendingAfterCancellation
        bookingDetails.commission = req.body.commission
        bookingDetails.Payout = req.body.Payout
        bookingDetails.isPayout = req.body.isPayout
        bookingDetails.isRefunded = req.body.isRefunded
        bookingDetails.isSettled = req.body.isSettled
        bookingDetails.settlementData = req.body.settlementData
        bookingDetails.refundData = req.body.refundData
        bookingDetails.save((err) => err ? res.send(err) : res.send("booking details added succesfully"));
    })

router.route('/:bookingId')
    //get booking details by booking Id
    .get((req, res) => {
        const query = { bookingId: req.params.bookingId }
        BookingDetails.findOne(query, (err, item) => err ? res.send(err) : res.send(item));
    })

module.exports = router