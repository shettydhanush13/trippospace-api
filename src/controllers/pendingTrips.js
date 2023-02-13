const express = require('express');
const router = express.Router();
const Pendingreview = require('../models/pendingReview');

router.route('/:userId')
    //to get details of pending trips by userId
    .get((req, res) => {
        const query = { user : req.params.userId } 
        Pendingreview.find(query, (err, trips) => err ? res.send(err) : res.send(trips))
    });

module.exports = router

