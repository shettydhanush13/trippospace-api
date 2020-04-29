const express = require('express');
const router = express.Router();
const Users = require('../app/models/users');

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
        users.social = req.body.social
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

module.exports = router