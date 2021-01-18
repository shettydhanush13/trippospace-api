const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');

router.route('/')
    //to get details of all the shop items
    .get((req, res) => {
        Shop.find({},(err, item) => err ? res.send(err) : res.send(item))
    });

router.route('/:id')
    //to get details of a shop item using Id
    .get((req, res) => {
        const query = { _id : req.params.id };
        Shop.findOne(query, (err, item) => err ? res.send(err) : res.send(item))
    });

module.exports = router