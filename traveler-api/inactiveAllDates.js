const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');

router.route("/")
    .post(function(req,res){
        let allDate = req.body.allDates
        let activeId = req.body.activeId

        const updateDates = date => {
            for(let i = 0;i<date.length;i++){
            if(date[i].value == activeId){
                if(req.body.type === "inactive"){
                    date[i].active = !date[i].active
                }else if(req.body.type === "delete"){
                    date.splice(i, 1);
                }   
            }}
            return date;
        }

        const query = { _id : { $in : req.body.datesArray }}
        Trip.update(query, { $set: { "booking.allDates" : req.body.type === "addNewDate" ? allDate : updateDates(allDate)} }, {multi: true} ,err => err ? res.send(err) : res.json({ message: "all dates updated" }))
    });

module.exports = router