const express = require('express');
const router = express.Router();
const { config } = require("../config")

const { accountSid, authToken, servicesId } = config.twillioConfig
const client = require('twilio')(accountSid, authToken);

router.route('/send-otp')
    .post(function (req, res) {
        client.verify.services(servicesId)
        .verifications
        .create({to: req.body.phone, channel: 'sms'})
        .then(verification => res.send(verification.status));
    })

router.route('/verify-otp')
    .post(function (req, res) {
        client.verify.services(servicesId)
        .verificationChecks
        .create({to: req.body.phone, code: req.body.code})
        .then(verification_check => res.send(verification_check.status));
    })

module.exports = router