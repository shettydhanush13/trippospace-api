const express = require('express');
const router = express.Router();
const TeeOrder = require('../app/models/teeOrder');

router.route('/')
    //generate a new order
    .post((req, res) => {
        var tee = new TeeOrder();
        tee.dateOfPurchase = req.body.dateOfPurchase,
        tee.delivered = req.body.delivered
        tee.waybill = req.body.waybill
        tee.orderId = req.body.orderId
        tee.refnum = req.body.refnum
        tee.title = req.body.title
        tee.price = req.body.price
        tee.thumb = req.body.thumb
        tee.color = req.body.color
        tee.colorCode = req.body.colorCode
        tee.size = req.body.size
        tee.userId = req.body.userId
        tee.quantity = req.body.quantity
        tee.save((err, response) => err ? res.send(err) : res.send(response));
    })

router.route('/:id')
    //get order details
    .get((req, res) => {
        TeeOrder.find({ userId: req.params.id }, (err, orders) => err ? res.send(err) : res.send(orders));
    })

module.exports = router