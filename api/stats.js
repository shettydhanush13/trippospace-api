const express = require('express');
const router = express.Router();
const Organizerstats = require('../app/models/organizerstats');

router.route('/')
    //to get completed trip stats
    .get(function (req, res) {
        Organizerstats.find({},{ trips : 0, organizerName : 0, organizerId :0, _id : 0 }, (err, data) => err ? res.send(err) : res.send(data))
    });

router.route('/')
    //to get completed trip stats
    .post((req, res) => {
        let organizerstats = new Organizerstats();
        organizerstats.organizerName = req.body.organizerName;
        organizerstats.organizerId = req.body.organizerId;
        organizerstats.trips = {
            "2020" : [],
            "2021" : []
        };
        organizerstats.stats = {
            "2020" : [
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "jan"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "feb"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "mar"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "apr"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "may"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "jun"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "jul"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "aug"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "sep"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "oct"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "nov"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "dec"
                }
            ],
            "2021" : [
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "jan"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "feb"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "mar"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "apr"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "may"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "jun"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "jul"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "aug"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "sep"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "oct"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "nov"
                },
                {
                    "revenue" : 0,
                    "slots" : 0,
                    "tripsCount" : 0,
                    "month" : "dec"
                }
            ]
        };
        organizerstats.save((err, response) => err ? res.send(err) : res.send(response));
    })

router.route('/reset/:organizerId')
    //to get completed trip stats
    .patch((req, res) => {
        let query = {organizerId : req.params.organizerId}
        let body = {
            trips : {
                "2020" : [],
                "2021" : []
            },
            stats : {
                "2020" : [
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "jan"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "feb"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "mar"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "apr"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "may"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "jun"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "jul"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "aug"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "sep"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "oct"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "nov"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "dec"
                    }
                ],
                "2021" : [
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "jan"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "feb"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "mar"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "apr"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "may"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "jun"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "jul"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "aug"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "sep"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "oct"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "nov"
                    },
                    {
                        "revenue" : 0,
                        "slots" : 0,
                        "tripsCount" : 0,
                        "month" : "dec"
                    }
                ]
            }
        }
        Organizerstats.updateOne(query, { $set : body}, (err, response) => err ? res.send(err) : res.send(response));
    })

router.route('/:organizerId')
    //to get stats of organizer using organizerId
    .get((req, res) => {
        const query = { organizerId : req.params.organizerId }
        Organizerstats.findOne(query, (err, data) => err ? res.send(err) : res.send(data))
    })

    .patch((req, res) => {
        const query = { organizerId : req.params.organizerId }
        Organizerstats.updateOne(query, {$set : req.body}, (err, data) => err ? res.send(err) : res.send(data))
    })

module.exports = router