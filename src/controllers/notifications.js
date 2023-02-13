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
const { config } = require('../config')

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
        const query = { organizerId : req.params.organizerId, type : req.query.type }
        let notifications = await OrganizerNotifications.find(query).sort({ "timestamp": -1 }).skip(0).limit(100)
        const { refund, commission } = config.organizerCommissions[req.params.organizerId]
        res.json({notifications, refund, commission})
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

        let { creditsRedeemed, commission, bookingId, date, cancelled, refunded, pending, refundPercentage, booked, travelers, price, grossPrice, tripId, user, organizerId, transactionId, paid } = req.body

        let commissionPerSlot = (grossPrice/booked)*(commission/100) 
        let refundCredits = (creditsRedeemed/booked)*cancelled*Number(refundPercentage)*0.01
        let Totalcommission = commissionPerSlot*(booked- cancelled) + ((commissionPerSlot*cancelled)*(100-refundPercentage)*0.01)
        let payout = paid-Totalcommission-refunded+(creditsRedeemed-refundCredits)

        const query = { bookingId }
        const body = {
            cancelled,
            refundAmount : refunded,
            refundPercentage,
            refundCredits,
            pendingAfterCancellation: pending,
            commission : Totalcommission,
            Payout : payout
        }

        const body2 = {
            travelers,
            credits : 50*travelers,
            pending,
            price
        }

        const query3 = { "content.bookingId" : bookingId, type : "BOOKING"}
        const body3 = {
            "content.pending" :pending,
            "content.quantity" : travelers,
            "content.price" : price,
            "content.grossPrice" : grossPrice
        }

        await BookingDetails.findOneAndUpdate(query, {$set : body})
        await OrganizerNotifications.findOneAndRemove({ _id : req.params.id })
        await OrganizerNotifications.findOneAndUpdate(query3, {$set : body3 })
        await UpcomingTrips.findOneAndUpdate(query, {$set : body2})

        let creditRefund = ((Number(creditsRedeemed)/booked)*cancelled)*refundPercentage*0.01

        let cancelRequest = new CancelRequest();
        cancelRequest.ticketId = generateCancelTicket()
        cancelRequest.tripId = tripId
        cancelRequest.bookingId = bookingId
        cancelRequest.user = user
        cancelRequest.organizerId = organizerId
        cancelRequest.transactionId = transactionId
        cancelRequest.tripDate = date
        cancelRequest.cancelDate = new Date()
        cancelRequest.booked = booked
        cancelRequest.cancelled = cancelled
        cancelRequest.price = price
        cancelRequest.paid = paid
        cancelRequest.pending = pending
        cancelRequest.refundPercentage = refundPercentage
        cancelRequest.creditsRedeemed = creditRefund
        cancelRequest.refund = Number(req.body.refunded)-creditRefund
        cancelRequest.refunded = false,
        cancelRequest.refundId = ""
        cancelRequest.refundDate = ""
        await cancelRequest.save();
        res.json({ message: "cancellation request accepted" })
    });

const Settlement = require('../models/settlePending');
router.route('/organizer/settle/:notificationId')
    .patch(async (req,res) => {
        const query = { _id : req.params.notificationId }
        const body = {
            "content.settleUp": true,
            "content.paid": req.body.paid,
            "content.pending": 0,
        }
        const body2 = {
            paid : req.body.paid,
            pending: 0,
        }
        await BookingDetails.findOneAndUpdate({_id : req.body.bookingId}, {$set : body2})
        await Settlement.findOneAndDelete({ notificationId : req.params.notificationId })
        await OrganizerNotifications.updateOne(query, {$set : body}, err => err ? res.send(err) : res.json({ message: "cancellation request confirmed" }))
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