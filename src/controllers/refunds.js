const express = require('express');
const axios = require('axios')
const router = express.Router();
const { config } = require("../config")

const {id, secret, baseUrl} = config.razorPayConfig

router.route('/')
    .post((req, res) => {
        let body = {
            "amount": 100,
            "speed": "optimum",
            "receipt": "Receipt No. 4",
            "notes": {}
          }
          
        const basicAuth = 'Basic ' + Buffer.from(`${id}:${secret}`, 'binary').toString('base64')
        axios.post(`${baseUrl}/payments/pay_GGqcY9n3vFV9vP/refund`, body, { headers : { Authorization: basicAuth } })
        .then((resp) => {
            res.send(resp.data)
        }).catch((err) => {
            res.send(err.response.data)
        })
    })

module.exports = router