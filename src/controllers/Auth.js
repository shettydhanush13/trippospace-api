const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const Organizer = require('../models/organizers');

router.route('/login')
    //user login
    .post((req, res) => {
        const query = { username: req.body.username }
        Users.findOne(query, (err, user) => err ? res.send(err) 
        : 
        user !== null ? req.body.password === user.password ? [user.password = null,res.json({ user })] : res.json({ "message": "incorrect password" }) 
        : res.json({ "message": "username does not exist" }))
    });

router.route('/agent-login')
    //agent login
    .post((req, res) => {
        const query = { username: req.body.username }
        Organizer.findOne(query, (err, user) => err ? res.send(err) 
        : 
        user !== null ? req.body.password === user.password ? [user.password = null,res.json({ user })] : res.json({ "message": "incorrect password" }) 
        : res.json({ "message": "username does not exist" }))
    });

router.route('/changePassword-organizer/:id')
    //change organizer password
    .patch((req, res) => {
        const query = { _id : req.params.id };
        Organizer.findOne(query, (err, user) => err ? res.send(err) : user.password !== req.body.currentPassword ? res.json({ error: "current password is incorrect" })
        :
        Organizer.update(query, { $set: { password: req.body.newPassword } }, err => err ? res.send(err) : res.json({ success: "users list updated" })))
    });

router.route('/changePassword/:id')
    //change user password
    .patch(function (req, res) {
        const query = { _id : req.params.id };
        Users.findOne(query, (err, user) =>  err ? res.send(err) : user.password !== req.body.currentPassword ? res.json({ error: "current password is incorrect" })
        :
        Users.update(query, { $set: { password: req.body.newPassword } }, err => err ? res.send(err) : res.json({ success: "users list updated" })))
    });

module.exports = router

