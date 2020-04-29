const express = require('express');
const router = express.Router();
const Trip = require('../app/models/trips');
const Places = require('../app/models/places');
const Users = require('../app/models/users');

router.route('/placesSearch')
    //get search results data
    .get((req, res) => {
        Trip.find({}, { place: 1 }, (err, places) => {
            if (err) { res.send(err) } else {
            let arr = [];
            for (let i = 0; i < places.length; i++) {
                arr.push(places[i].place)
            }
            let temp = arr.reduce((r, e) => (r.push(...e), r), [])
            let uniqueArray = [...new Set(temp)];
            Places.find({}, { title: 1 }, (err, place) => {
                let arr2 = [];
                for (let i = 0; i < place.length; i++) {
                    arr2.push(place[i].title)
                }
                Users.find({}, { first_name: 1, last_name:1, _id:1, username:1, profile_pic:1}, (err, user) => {
                    let arr3 = [];
                    for (let i = 0; i < user.length; i++) {
                        arr3.push(user[i])
                    }
                    res.send({explore:arr2,places:uniqueArray,users:arr3})
                })
            })
        }
    });
});

module.exports = router