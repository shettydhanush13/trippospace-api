const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');
const Organizer = require('../app/models/organizers')

router.route('/')
    //to add a new organizer
    .post((req, res) => {
        let organizer = new Organizer();
        organizer.name = req.body.name;
        organizer.username = req.body.username;
        organizer.profile_pic = req.body.profile_pic;
        organizer.cover_pic = req.body.cover_pic;
        organizer.website = req.body.website;
        organizer.location = req.body.location;
        organizer.description = req.body.description;
        organizer.contact = req.body.contact;
        organizer.social = req.body.social;
        organizer.rating = req.body.rating;
        organizer.save( err => err ? res.send(err) : res.json({ message: "organizer added succesfully" }))
    })

    //to get list of all organizers
    .get((req, res) => {
        Organizer.find((err, organizers) => err ? res.send(err) : res.send(organizers))
    });

router.route('/trips/:id')
    //to get all active trips by an organizer using organizerID
    .get((req, res) => {
        const query = { organizerId: req.params.id, isActive: true };
        Trip.find(query, (err, trips) => err ? res.send(err) : res.send(trips))
    });

router.route('/:id')
    //to get details of an organizer
    .get((req, res) => {
        const query = { _id : req.params.id };
        Organizer.findOne(query, (err, organizer) => err ? res.send(err) : res.send(organizer))
    })

    //to edit organizer details
    .patch((req, res) => {
        const query = { _id : req.params.id };
        Organizer.updateOne(query, { $set: req.body }, err => err ? res.send(err) : res.json({ message: "organizer details updated" }))
    })

    //to delete an organizer
    .delete((req, res) => {
        const query = { _id : req.params.id };
        Organizer.deleteOne(query, err => err ? res.send(err) : res.json({ message: "organizer deleted succesfully" }))
    });


module.exports = router