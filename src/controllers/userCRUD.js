const express = require('express');
const router = express.Router();
const Users = require('../models/users');

router.route('/')
    //to register a new user
    .post((req, res) => {
        let users = new Users();
        users.first_name = req.body.first_name;
        users.last_name = req.body.last_name;
        users.username = req.body.username;
        users.password = req.body.password;
        users.email = req.body.email;
        users.phone = req.body.phone;
        users.profile_pic = req.body.profile_pic;
        users.stats = req.body.stats;
        users.referalCode = req.body.referalCode;
        users.social = req.body.social;
        users.bucketList = []
        users.save((err, trip) => err ? res.send(err) : res.json({ "success": "user added succesfully : " + trip._id }))
    });

router.route('/:userId')
    //to edit user details using userId
    .patch((req, res) => {
        const query = { _id: req.params.userId };
        Users.updateOne(query, { $set: req.body }, err => err ? res.send(err) : res.json({ success: "users list updated" }))
    })

    //to get user details using userId
    .get((req, res) => {
        const query = { _id: req.params.userId }
        Users.findOne(query, (err,user) => err ? res.send(err) : res.send(user))
    });

router.route('/cash/:id')
    //to get trippo-cash details of a user using userId
    .get((req, res) => {
        const query = { _id : req.params.id }
        Users.findOne(query, (err, user) => err ? res.send(err) : res.send(user.stats))
    });

router.route('/updateCredits')
    //to get trippo-cash details of a user using userId
    .post((req, res) => {
        const query = { _id : req.body.id }
        Users.findOne(query, (err, user) => err ? res.send(err) : 
        Users.updateOne(query, { $set : {"stats.credits" : user.stats.credits + req.body.credits}}, (err) => err ? res.send(err) :  res.send("credits send successfully")))
    });


router.route('/referal')
    //to refer a user
    .post(function (req, res) {
        const query = { referalCode : req.body.code }
        Users.findOne(query, (err, user) => user === null ? res.send("invalid referal code")
        : 
        Users.updateOne(query, { $set : { "stats.credits" : user.stats.credits + 200 } }, () => res.send("referal successful")))         
    })

module.exports = router