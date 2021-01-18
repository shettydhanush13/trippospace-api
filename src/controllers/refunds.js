const express = require('express');
const axios = require('axios')
const router = express.Router();
const { config } = require("../config")

router.route('/')
    //bookmark or unbookmark a trip using tripId
    .post((req, res) => {
        let body = {
            "amount": 100,
            "speed": "optimum",
            "receipt": "Receipt No. 4",
            "notes": {
              "notes_key_1":"Tea, Earl Grey, Hot",
              "notes_key_2":"Tea, Earl Grey… decaf."
            }
          }
          
        const basicAuth = 'Basic ' + Buffer.from(`${config.razorPayConfig.razorpayId}:${config.razorPayConfig.razorPaySecret}`, 'binary').toString('base64')
        let headers = {
           Authorization: basicAuth
        }
        axios.post("https://api.razorpay.com/v1/payments/pay_GGqcY9n3vFV9vP/refund", body, { headers })
        .then((resp) => {
            console.log(resp.data)
            res.send(resp.data)
        }).catch((err) => {
            console.log(err.response.data)
            res.send(err.response.data)
        })
    })

module.exports = router