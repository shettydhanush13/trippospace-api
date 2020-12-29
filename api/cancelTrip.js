const express = require('express');
const router = express.Router();
const CancelRequest = require('../app/models/cancellationRequest');

router.route('/')
    //add item to cancel request list
    .post((req, res) => {
        const shuffleArray = array => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array
        }
        const generateCancelTicket = () => {
            let id = `${req.body.tripId}${req.body.bookingId}${req.body.organizerId}`
            return shuffleArray(id.split("")).slice(0,12).join("")
        }
        let cancelRequest = new CancelRequest();
        cancelRequest.ticketId = generateCancelTicket()
        cancelRequest.tripId = req.body.tripId
        cancelRequest.bookingId = req.body.bookingId
        cancelRequest.userId = req.body.userId
        cancelRequest.organizerId = req.body.organizerId
        cancelRequest.transactionId = req.body.transactionId
        cancelRequest.date = req.body.date
        cancelRequest.slots = req.body.slots
        cancelRequest.slotsToCancel = req.body.slotsToCancel
        cancelRequest.amountPaid = req.body.amountPaid
        cancelRequest.save((err, response) => err ? res.send(err) : res.send(response));
    })
    //get all cancel request list
    .get((req, res) => {
        CancelRequest.find({}, (err, item) => err ? res.send(err) : res.send(item));
    });

router.route('/:organizerId')
    //get all cancel request for an organizer
    .get((req, res) => {
        const query = { organizerId: req.params.organizerId }
        CancelRequest.find(query, (err, item) => err ? res.send(err) : res.send(item));
    })

router.route('/:ticketId')
    //get all cancel request by ticket id
    .get((req, res) => {
        const query = { ticketId: req.params.ticketId }
        CancelRequest.find(query, (err, item) => err ? res.send(err) : res.send(item));
    })

module.exports = router