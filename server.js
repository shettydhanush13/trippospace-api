var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Trip = require('./app/models/trips')
var Organizer = require('./app/models/organizers')
var Customer = require('./app/models/customers')
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

var port = process.env.PORT || 3000;

mongoose.connect('mongodb://heroku_4bnf62cl:659mqm9veus9q1rurnobmbkq93@ds229088.mlab.com:29088/heroku_4bnf62cl');

var router = express.Router();

app.use('/api', router)

router.use(function (req, res, next) {
    console.log("middleware");
    next();
});

//1
//to test if the api is working
router.get('/', function (req, res) {
    res.json({ message: "welcome to trippospace" });
});

router.route('/trip')
    //2
    //to post a new trip
    .post(function (req, res) {
        var trip = new Trip();
        trip.title = req.body.title;
        trip.destination = req.body.destination;
        trip.thumb = req.body.thumb;
        trip.isFav = req.body.isFav;
        trip.description = req.body.description;
        trip.tags = req.body.tags;
        trip.place = req.body.place;
        trip.organizer = req.body.organizer;
        trip.booking = req.body.booking;
        trip.itinerary = req.body.itinerary;
        trip.pickup = req.body.pickup;
        trip.inclusions = req.body.inclusions;
        trip.exclutions = req.body.exclutions;
        trip.save(function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "trip added succesfully" })
        });
    })

    //3
    //to get details of all the trips
    .get(function (req, res) {
        Trip.find(function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    });

router.route('/trip/:tripid')
    //4
    //to get details of a trip by tipId
    .get(function (req, res) {
        var query = {
            _id: req.params.tripid
        };
        Trip.find(query, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    })

    //5
    //to delete a trip by tipId
    .delete(function (req, res) {
        var query = {
            _id: req.params.tripid
        };
        Trip.deleteOne(query, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "trip deleted succesfully" })
        });
    });

router.route('/from/:place')
    //6
    //to get details of a trip depatrting from a particular city
    .get(function (req, res) {
        var query = {
            "booking.departureCity": req.params.place
        }
        Trip.find(query, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    })

router.route('/organizer')
    //8
    //to add a new organizer
    .post(function (req, res) {
        var organizer = new Organizer();
        organizer.name = req.body.name;
        organizer.username = req.body.username;
        organizer.logo = req.body.logo;
        organizer.website = req.body.website;
        organizer.location = req.body.location;
        organizer.description = req.body.description;
        organizer.contact = req.body.contact;
        organizer.save(function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "organizer added succesfully" })
        });
    })

    //3
    //to get list of all organizers
    .get(function (req, res) {
        Organizer.find(function (err, organizer) {
            if (err) {
                res.send(err)
            }
            res.send(organizer)
        });
    });

router.route('/organizer/:id')

    //to get details of a particular organizer
    .get(function (req, res) {
        var query = {
            _id: req.params.id
        };
        Organizer.find(query, function (err, organizer) {
            if (err) {
                res.send(err)
            }
            res.send(organizer)
        });
    })

    //to edit organizer details
    .patch(function (req, res) {
        var query = {
            _id: req.params.id
        };
        Organizer.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "organizer data updated" })
        });
    })

    //to delete an organizer
    .delete(function (req, res) {
        var query = {
            _id: req.params.id
        };
        Organizer.deleteOne(query, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "organizer deleted succesfully" })
        });
    });


router.route('/bookmark')
    //get bookmarked trips for an organizer
    .get(function (req, res) {

        Trip.find({ "isFav": true }, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    })


router.route('/bookmark/:tripId')
    //bookmark or unbookmark a trip
    .patch(function (req, res) {
        var query = {
            _id: req.params.tripId
        };

        Trip.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "bookmarks updated" })
        });
    })

//
router.route('/customer')
    //bookmark or unbookmark a trip
    .post(function (req, res) {
        var customer = new Customer();
        customer.name = req.body.name;
        customer.mail = req.body.mail;
        customer.phone = req.body.phone;
        customer.organizer = req.body.organier;
        customer.source = req.body.source;
        customer.save(function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: res })
        });
    });

router.route('/customer/:tripId')

    .get(function (req, res) {
        var query = {
            _id: req.params.tripId
        }
        Trip.find(query, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip.booking.customerList)
        });
    })

    //update customer list of a trip
    .patch(function (req, res) {
        var query = {
            _id: req.params.tripId
        };
        Trip.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "customer list updated" })
        });
    });






app.listen(port);

console.log("working at port : ", port)





