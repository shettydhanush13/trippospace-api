const express = require('express');
const router = express.Router();
const Organizer = require('../app/models/organizers');
const Users = require('../app/models/users')

router.route('/checkOrganizerid')
    //to check if organizer username exists
    .post((req, res) => {
        const query = { username: req.body.username }
        Organizer.findOne(query, (err, user) => err ? res.send(err) : 
        user !== null ? res.json({ username: true }) : res.json({ username : false }))
    });
    
router.route('/checkUsername')
    //to check if username for user exists
    .post((req, res) => {
        const query = { username: req.body.username }
        Users.findOne(query, (err, user) => err ? res.send(err) : 
        user !== null ? res.json({ username: true, id : user._id }) : res.json({ username : false }))
    });

router.route('/checkEmail')
    //to check if user email exists
    .post((req, res) => {
        const query = { email: req.body.email }
        Users.findOne(query, (err, user) => err ? res.send(err) : 
        user !== null ? res.json({ email : true }) : res.json({ email : false }))
    });

router.route('/checkPhone')
    //to check if user phone number exists
    .post((req, res) => {
        const query = { phone : req.body.phone }
        Users.findOne(query, (err, user) => err ? res.send(err) : 
        user !== null ? res.json({ phone : true }) : res.json({ phone : false }))
    });

module.exports = router