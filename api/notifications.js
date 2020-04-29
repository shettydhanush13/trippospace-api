const express = require('express');
const router = express.Router();
const Users = require('../app/models/users');
const Organizer = require('../app/models/organizers')
const Templates = require('../templates/mailTemplates');

router.route('/shop-notification')
    .post((req, res) => {
        Templates.ShopNotification(req)
        .then(response => res.json(response))
        .catch(error => res.send(error))
    })

router.route('/passport-notification')
    .post((req, res) => {
        Templates.PassportNotification(req)
        .then(response => res.json(response))
        .catch(error => res.send(error))
    })

router.route('/welcome-mail')
    .post((req, res) => {
        Templates.Welcome(req)
        .then(response => res.json(response))
        .catch(error => res.send(error))
    });

router.route('/reset-password')
    .post((req, res) => {
        Templates.ForgotPassword(req,Users,Organizer)
        .then(response => res.json(response))
        .catch(error => res.send(error))
    });

router.route('/booking-notification')
    .post((req, res) => {
        Templates.BookNotification(req)
        .then(response => res.json(response))
        .catch(error => res.send(error))      
    });  

module.exports = router