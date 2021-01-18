const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.route('/')
    //active or inactive a trip
    .post((req, res) => {
        const updateDates = date => {
            for(let i = 0; i < date.length; i++ ){
            if(date[i].value == req.body.tripId){
                if(req.body.type === "inactive"){
                    date[i].active = !date[i].active
                }else if(req.body.type === "delete"){
                    date.splice(i, 1);
                }   
            }}
            return date;
        }

        Trip.updateOne({_id: req.body.tripId}, { $set: req.body.isActive }, err => err ? res.send(err) 
        :
        Trip.update({ _id : { $in : req.body.datesArray }}, { $set: { "booking.allDates" : req.body.type === "addNewDate" ? req.body.allDates : updateDates(req.body.allDates)} }, {multi: true} , err => err ? res.send(err) 
        :
        res.json({ message: "all dates updated" })))    
    });

router.route('/:organizerId')
    //get inactive trips for an organizer
    .get((req, res) => {
        const query = { isActive : false, organizerId : req.params.organizerId }
        Trip.find(query, (err,trip) => err ? res.send(err) : res.send(trip))
    })

module.exports = router