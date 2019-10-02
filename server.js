var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var Trip = require('./app/models/trips')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

var port = process.env.PORT || 3000;

// mongoose.connect('mongodb://localhost:27018/codealong');

var router = express.Router();

app.use('/api', router)

router.use(function (req, res, next) {
    console.log("middleware");
    next();
});

router.get('/', function (req, res) {
    res.json({ message: "welcome to trippospace" });
});

// router.route('/trip')

//     .post(function (req, res) {
//         var trip = new Trip();
//         trip.title = req.body.title;
//         trip.destination = req.body.destination;
//         trip.thumb = req.body.thumb;
//         trip.description = req.body.description;
//         trip.tags = req.body.tags;
//         trip.place = req.body.place;
//         trip.organizer = req.body.organizer;
//         trip.booking = req.body.booking;
//         trip.itinerary = req.body.itinerary;
//         trip.pickup = req.body.pickup;
//         trip.inclusions = req.body.inclusions;
//         trip.exclutions = req.body.exclutions;
//         trip.save(function (err) {
//             if (err) {
//                 res.send(err)
//             }
//             res.json({ message: "trip added succesfully" })
//         });
//     })

//     .get(function (req, res) {
//         Trip.find(function (err, trip) {
//             if (err) {
//                 res.send(err)
//             }
//             res.send(trip)
//         });
//     });

// router.route('/trip/:tripid')

//     .get(function (req, res) {

//         var query = {
//             _id: req.params.tripid
//         };

//         Trip.find(query, function (err, trip) {
//             if (err) {
//                 res.send(err)
//             }
//             res.send(trip)
//         });
//     });

app.listen(port);

console.log("working at port : ", port)


