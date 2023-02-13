const express = require('express');
const router = express.Router();
const Payouts = require('../models/payouts');
const axios = require("axios")

const { config } = require("../config")
const {id, secret, baseUrl} = config.razorPayConfig

router.route('/')
    .get((req,res) => {
        Payouts.find({settled: false}, (err, item) => err ? res.send(err) : res.send(item));
    });

router.route('/:id')
    .post(async (req,res) => {
       const basicAuth = 'Basic ' + Buffer.from(`${id}:${secret}`, 'binary').toString('base64')
       axios.post(`${baseUrl}/transfers`, req.body, { headers : { Authorization: basicAuth } })
       .then(async resp => {
           await Payouts.updateOne({_id: req.params.id}, { $set : { settled :  true }});
           res.send(resp.data.id)
        }).catch(err => console.log(err.response.data.error))
    });

module.exports = router