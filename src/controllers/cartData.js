const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

router.route('/')
    //add item to cart
    .post((req, res) => {
        let cart = new Cart();
        cart.productId = req.body.productId
        cart.title = req.body.title
        cart.price = req.body.price
        cart.thumb = req.body.thumb
        cart.color = req.body.color
        cart.size = req.body.size
        cart.userId = req.body.userId
        cart.quantity = 1
        cart.save((err, response) => err ? res.send(err) : res.send(response));
    })

router.route('/:userId')
    //get cart items using userId
    .get((req, res) => {
        const query = { userId: req.params.userId }
        Cart.find(query, (err, item) => err ? res.send(err) : res.send(item));
    })

router.route('/:itemId')
    //remove item from cart using itemId
    .delete((req, res) => {
        const query = { _id: req.params.itemId }
        Cart.deleteOne(query, err => err ? res.send(err) : res.json({ message : "Item removed from cart successfully" }));
    })

module.exports = router