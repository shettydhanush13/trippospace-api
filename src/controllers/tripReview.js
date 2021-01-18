const express = require('express');
const router = express.Router();
const Tripreviews = require('../models/tripReview');
const Pendingreview = require('../models/pendingReview')

router.route('/')
    //add a trip review and remove that id from pending reviews once review added.
    .post(function (req, res) {
        const tripreviews = new Tripreviews();
        tripreviews.name = req.body.name,
        tripreviews.id = req.body.id,
        tripreviews.thumb = req.body.thumb,
        tripreviews.rating = req.body.rating,
        tripreviews.tripDate = req.body.tripDate,
        tripreviews.review = req.body.review,
        tripreviews.images = req.body.images,
        tripreviews.organizerName = req.body.organizerName,
        tripreviews.organizerId = req.body.organizerId,
        tripreviews.tripTitle = req.body.tripTitle,
        tripreviews.days = req.body.days
        tripreviews.date = req.body.date
        tripreviews.bookingId = req.body.bookingId
        tripreviews.save((err, response) => err ? res.send(err) 
        : 
        Pendingreview.deleteOne({ _id: req.body.pendingId }, err => err ? res.send(err) : res.send(response._id))) 
    });

router.route('/:reviewId')
    //edit a trip review using reviewId
    .patch((req, res) => {
        const query = { _id: req.params.reviewId };
        Tripreviews.update(query, { $set: req.body }, err => err ? res.send(err) : res.json({ success : "review updated" })) 
    });

router.route('/reviews/:array')
    //edit a trip review using reviewId
    .get((req, res) => {
        const query = { _id : { $in: JSON.parse(req.params.array) } }
        Tripreviews.find(query, (err, reviews) => err ? res.send(err) : res.send(reviews))
    });

module.exports = router