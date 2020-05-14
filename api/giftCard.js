const express = require('express');
const router = express.Router();
const Gift = require('../app/models/gift');

router.route('/')
    //to create a gift card
    .post((req, res) => {
        let gift = new Gift();
        gift.code = req.body.code,
        gift.value = req.body.value,
        gift.redeemed = false
        gift.save(err => err ? res.send(err) : res.json({ message: "gift card created succesfully" }))
    });

router.route('check/:code')
    //to check a gift card is valid
    .get((req, res) => {
        const query = { code : req.params.code }
        Gift.findOne(query, (err, card) => err ? res.send(err) 
        : 
        card === null ? res.json({error:"INVALID CODE"})
        :
        card.redeemed ? res.json({error:"CODE ALREADY REDEEMED"}) : res.json({value: ParseInt(card.value)}))
    });

router.route('apply/:code')
    //to redeem a gift card
    .get((req, res) => {
        const query = { code : req.params.code }
        Gift.updateOne(query, { $set : { redeemed : true } }, err => err ? res.send(err) : res.json({value: card.value}))
    });

module.exports = router