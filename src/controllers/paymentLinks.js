const express = require('express');
const router = express.Router();
const axios = require("axios")
const Settlement = require('../models/settlePending');
const OrganizerNotifications = require("../models/organizerNotifications")
const Booking = require('../models/bookingDetails')

const { getRazorpayHeaders } = require("../helpers/razorpay")
const { headers, baseUrl } = getRazorpayHeaders()

router.route('/')
    .post((req,res) => {
        let body = {
            "amount": req.body.pending*100,
            "currency": "INR",
            "accept_partial": false,
            "expire_by": 1691097057,
            "reference_id": req.body.reference_id,
            "description": req.body.description,
            "customer": req.body.user,
            "notify": {
                "sms": true,
                "email": true
            },
            "reminder_enable": true,
            "notes": {
                "policy_name": "Trippospace settlement"
            },
            "callback_url": "https://trippospace.com/",
            "callback_method": "get"
        }

        axios.post(`${baseUrl}/payment_links`, body, headers)
        .then(async resp => {
            const { id, reference_id, short_url} = resp.data
            req.body.id = id
            req.body.short_url = short_url

            await OrganizerNotifications.findOneAndUpdate(
                {_id : req.body.notificationId},
                { $set : { "content.settleUpData" : { id, reference_id, short_url}} }
            )

            await Booking.findOneAndUpdate(
                { bookingId : req.body.bookingId },
                { $set : { "settlementData" : { id, reference_id, short_url }} }
            )

            let settlement = new Settlement();
            settlement.tripId = req.body.tripId
            settlement.notificationId = req.body.notificationId
            settlement.bookingId = req.body.bookingId
            settlement.tripName = req.body.tripName
            settlement.user = req.body.user
            settlement.organizerId = req.body.organizerId
            settlement.id = req.body.id
            settlement.description = req.body.description
            settlement.reference_id = req.body.reference_id
            settlement.short_url = req.body.short_url
            settlement.price = req.body.price
            settlement.paid = req.body.paid
            settlement.pending = req.body.pending
            settlement.save((err, response) => err ? res.send(err) : res.json({ response }))    
        }).catch(err => console.log(err.response.data.error))   
    });

router.route('/:id')
    .get((req,res) => {
        axios.get(`${baseUrl}/payment_links/${req.params.id}`, headers)
        .then(resp => {
            res.send(resp.data)
        }).catch(err => console.log(err.response.data.error))
    });

module.exports = router