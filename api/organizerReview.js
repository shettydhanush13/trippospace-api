const express = require('express');
const router = express.Router();
const Reviews = require('../app/models/reviews');

router.route('/')
    //publish a review for organizer
    .post((req, res) => {
        let reviews = new Reviews();
        reviews.name = req.body.name
        reviews.id = req.body.id,
        reviews.trip = req.body.trip,
        reviews.tripDate = req.body.tripDate,
        reviews.rating = req.body.rating,
        reviews.review = req.body.review,
        reviews.organizer = req.body.organizerId
        reviews.bookingId = req.body.bookingId
        reviews.save((err, response) => err ? res.send(err) : res.json({ id : response })) 
    });

router.route('/getReviews/:organizerId')
    //get all reviews for an organizer using organizerId
    .get((req, res) => {
        const query = { organizer : req.params.organizerId }
        Reviews.find(query, (err, reviews) => err ? res.send(err) : res.send(reviews))
    });

router.route('/:reviewId')
    //edit an organizer review using reviewId
    .patch((req, res) => {
        const query = { _id: req.params.reviewId };
        Reviews.update(query, { $set: req.body }, err => err ? res.send(err) : res.json({ success : "review updated" })) 
    });

module.exports = router