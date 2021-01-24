const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const Organizer = require('../models/organizers')
const Templates = require('../templates');
const UserNotifications = require("../models/userNotifications")
const OrganizerNotifications = require("../models/organizerNotifications")
const BookingDetails = require("../models/bookingDetails")
const CancelRequest = require("../models/cancellationRequest")
const UpcomingTrips = require("../models/upcomingTrips");

router.route('/user')
    .post((req, res) => {
        let userNotifications = new UserNotifications();
        userNotifications.userId = req.body.userId
        userNotifications.type = req.body.type
        userNotifications.date = req.body.date
        userNotifications.timestamp = req.body.timestamp
        userNotifications.content = req.body.content
        userNotifications.seen = req.body.seen
        userNotifications.save(err => err ? res.send(err) : res.json({ message: "user notification saved" }))
    });

router.route('/user/:userId')
    .get((req,res) => {
        const query = { userId : req.params.userId }
        UserNotifications.find(query, (err, notifications) => err ? res.send(err) : res.send(notifications))
    });

router.route('/organizer')
    .post((req, res) => {
        let organizerNotifications = new OrganizerNotifications();
        organizerNotifications.organizerId = req.body.organizerId
        organizerNotifications.type = req.body.type
        organizerNotifications.date = req.body.date
        organizerNotifications.timestamp = req.body.timestamp
        organizerNotifications.content = req.body.content
        organizerNotifications.seen = req.body.seen
        organizerNotifications.save(err => err ? res.send(err) : res.json({ message: "organizer notification saved" }))
    })

router.route('/organizer/:organizerId')
    .get(async (req,res) => {
        const query = { organizerId : req.params.organizerId }
        let count = await OrganizerNotifications.find(query)
        let notifications = await OrganizerNotifications.find(query).sort({ "timestamp": -1 }).skip(0).limit(100)
        res.json({notifications,count:count.length})
    });

router.route('/organizer/confirm/:id')
    .patch(async (req,res) => {
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
        const query = { _id : req.params.id }
        const body = {
            "content.cancelled": true,
            "content.refundPercentage" : req.body.refundPercentage,
            "content.pending" : req.body.pending,
        }
        const query2 = { bookingId : req.body.bookingId }
        const body2 = {
            cancelled : req.body.cancelled,
            refunded : req.body.refunded
        }
        const body3 = {
            travelers : req.body.travelers,
            credits : 50*req.body.travelers,
            pending : req.body.pending,
            price : req.body.price
        }
        const query4 = { "content.bookingId" : req.body.bookingId, type : "BOOKING"}
        const body4 = {
            "content.pending" : req.body.pending,
            "content.quantity" : req.body.travelers,
            "content.price" : req.body.price
        }
        await BookingDetails.updateOne(query2, {$set : body2})
        await OrganizerNotifications.updateOne(query, {$set : body})
        await OrganizerNotifications.updateOne(query4, {$set : body4 })
        await UpcomingTrips.updateOne(query2, {$set : body3})
        
        let cancelRequest = new CancelRequest();
        cancelRequest.ticketId = generateCancelTicket()
        cancelRequest.tripId = req.body.tripId
        cancelRequest.bookingId = req.body.bookingId
        cancelRequest.user = req.body.user
        cancelRequest.organizerId = req.body.organizerId
        cancelRequest.transactionId = req.body.transactionId
        cancelRequest.tripDate = req.body.date
        cancelRequest.cancelDate = new Date()
        cancelRequest.booked = req.body.booked
        cancelRequest.cancelled = req.body.cancelled
        cancelRequest.price = req.body.price
        cancelRequest.paid = req.body.paid
        cancelRequest.pending = req.body.pending
        cancelRequest.refundPercentage = req.body.refundPercentage
        cancelRequest.refund = req.body.refunded
        cancelRequest.refunded = false,
        cancelRequest.refundId = ""
        cancelRequest.refundDate = ""
        await cancelRequest.save();
        res.json({ message: "cancellation request confirmed" })
    });

router.route('/organizer/settle/:id')
    .patch(async (req,res) => {
        const query = { _id : req.params.id }
        const body = {
            "content.settleUp": true,
            "content.paid": req.body.paid,
            "content.pending": 0,
        }
        OrganizerNotifications.updateOne(query, {$set : body}, err => err ? res.send(err) : res.json({ message: "cancellation request confirmed" }))
    });


router.route('/welcome-mail')
    .post((req, res) => {
        Templates.Welcome(req)
        .then(response => res.json(response))
        .catch(error => res.send(error))
    });

router.route('/reset-password')
    .post((req, res) => {
        Templates.ForgotPassword(req, Users, Organizer)
        .then(response => res.json(response))
        .catch(error => res.send(error))
    });

router.route('/booking-notification')
    .post((req, res) => {
        Templates.BookNotification(req)
        .then(response => res.json(response))
        .catch(error => res.send(error))      
    });  

module.exports = router