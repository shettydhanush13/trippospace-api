var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Trip = require('./app/models/trips');
var Organizer = require('./app/models/organizers');
var Customer = require('./app/models/customers');
var Users = require("./app/models/users")
var cors = require('cors');
var AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');

AWS.config.update({ region: 'us-west-2', accessKeyId: 'AKIAYTSD6F4Z3JZZ76UQ', secretAccessKey: "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" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

s3 = new AWS.S3({ apiVersion: '2006-03-01' });

var port = process.env.PORT || 3000;

mongoose.connect('mongodb://heroku_4bnf62cl:659mqm9veus9q1rurnobmbkq93@ds229088.mlab.com:29088/heroku_4bnf62cl');

var router = express.Router();

app.use('/api', router)

router.use(function (req, res, next) {
    console.log("middleware");
    next();
});

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: "trippospace",
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
};

router.route('/upload')
    //2
    //to upload an image to s3
    .post(function (request, response) {
        const form = new multiparty.Form();
        form.parse(request, async (error, fields, files) => {
            if (error) throw new Error(error);
            try {
                const path = files.file[0].path;
                const buffer = fs.readFileSync(path);
                const type = fileType(buffer);
                const timestamp = Date.now().toString();
                const fileName = `bucketFolder/${timestamp}-lg`;
                const data = await uploadFile(buffer, fileName, type);
                return response.status(200).send(data);
            } catch (error) {
                return response.status(400).send(error);
            }
        });
    })

//1
//to test if the api is working
router.get('/', function (req, res) {
    res.json({ message: "welcome to trippospace" });
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Buckets);
        }
    });
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
        trip.isActive = req.body.isActive;
        trip.description = req.body.description;
        trip.tags = req.body.tags;
        trip.place = req.body.place;
        trip.organizer = req.body.organizer;
        trip.booking = req.body.booking;
        trip.itinerary = req.body.itinerary;
        trip.pickup = req.body.pickup;
        trip.inclusions = req.body.inclusions;
        trip.exclutions = req.body.exclutions;
        trip.save(function (err, response) {
            if (err) {
                res.send(err)
            }
            res.send({ "id": response._id })
        });
    })

    //3
    //to get details of all the trips
    .get(function (req, res) {
        var query = {
            isActive: true
        };
        Trip.find(query, function (err, trip) {
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
        organizer.profile_pic = req.body.profile_pic;
        organizer.cover_pic = req.body.cover_pic;
        organizer.website = req.body.website;
        organizer.location = req.body.location;
        organizer.description = req.body.description;
        organizer.contact = req.body.contact;
        organizer.social = req.body.social;
        organizer.rating = req.body.rating;
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

router.route('/organizer/trips/:id')
    .get(function (req, res) {
        var query = {
            organizer: req.params.id
        };
        Trip.find(query, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
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
        Trip.find({ "isFav": true, "isActive": true }, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    })

router.route('/inactive')
    //get inactive trips for an organizer
    .get(function (req, res) {
        Trip.find({ "isActive": false }, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    })

router.route('/inactive/:tripId')
    //active or inactive a trip
    .patch(function (req, res) {

        var query = {
            _id: req.params.tripId
        };

        Trip.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "trip updated" })
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
        customer.save(function (err, res) {
            if (err) {
                res.send(err)
            }
            res.send({ "id": response })
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
            res.send({ "customers": trip[0].booking.customerList })
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

router.route('/register')

    //to register a new user
    .post(function (req, res) {
        var users = new Users();

        users.first_name = req.body.first_name;
        users.last_name = req.body.last_name;
        users.username = req.body.username;
        users.password = req.body.password;
        users.email = req.body.email;
        users.phone = req.body.phone;
        users.profile_pic = req.body.profile_pic;
        users.cover_pic = req.body.cover_pic;
        users.stats = req.body.stats;
        users.trips = req.body.trips;

        Users.findOne({
            username: req.body.username
        }, function (err, user) {
            if (user !== null) {
                res.json({ "message": "username exists" })
            } else {
                users.save(function (err, trip) {
                    if (err) {
                        res.send(err)
                    }
                    res.json({ "success": "user added succesfully : " + trip._id })
                });
            }
        });
    });

router.route('/user/:userId')

    .get(function (req, res) {
        var query = {
            _id: req.params.userId
        }
        Users.find(query, function (err, user) {
            if (err) {
                res.send(err)
            }
            res.send({ "userdata": userdata })
        });
    })

    .patch(function (req, res) {
        var query = {
            _id: req.params.userId
        };
        Users.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "user data updated" })
        });
    });

router.route('/login')
    //to check if user exist
    .post(function (req, res) {
        Users.findOne({
            username: req.body.username
        }, function (err, user) {
            if (user !== null) {
                if (req.body.password === user.password) {
                    res.json({ user })
                } else {
                    res.json({ "message": "incorrect password" })
                }
            } else {
                res.json({ "message": "username does not exist" })
            }
        });
    });


app.listen(port);

console.log("working at port : ", port)





