var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Trip = require('./app/models/trips');
var Organizer = require('./app/models/organizers');
var Customer = require('./app/models/customers');
var Users = require("./app/models/users");
var Places = require("./app/models/places");
var Videos = require("./app/models/videos");
var Category = require("./app/models/category")
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
        trip.credits = req.body.credits;
        trip.videos = req.body.videos;
        trip.organizerId = req.body.organizerId;
        trip.organizerName = req.body.organizerName;
        trip.save(function (err, response) {
            if (err) {
                res.send(err)
            } else {
                for (let i = 0; i < req.body.tags.length; i++) {
                    Category.update({ id: req.body.tags[i] }, { $push: { "trips": response._id.toString() } }, function (err, category) {
                        if (err) {
                            res.send(err)
                        } else {
                            res.send(response._id)
                        }
                    });
                }
            }
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
    })

    .patch(function (req, res) {
        var query = {
            _id: req.params.tripid
        };
        Trip.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "trip data updated" })
        });
    });

router.route('/tripCategory/:category')
    //4
    //to get details of a trip by tipId

    .get(function (req, res) {
        Trip.find({ tags: { $all: [req.params.category] } }, function (err, trip) {
            if (err) {
                res.send(err)
            }
            let city = ["ALL"]
            for (let i = 0; i < trip.length; i++) {
                city.push(trip[i].booking.departureCity)
            }
            var city1 = [...new Set(city)]
            if (req.query.departure === "ALL") {
                res.json({
                    trips: trip,
                    search: city1,
                    selected: "ALL"
                })
            } else {
                res.json({
                    trips: trip.filter(ele => ele.booking.departureCity === req.query.departure),
                    search: city1,
                    selected: req.query.departure
                })
            }
        });
    })

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
            organizerId: req.params.id,
            isActive: true
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


router.route('/bookmark/:id')
    //get bookmarked trips for an organizer
    .get(function (req, res) {
        Trip.find({ "isFav": true, "isActive": true,  organizerId: req.params.id }, function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.send(trip)
        });
    })

router.route('/inactive/:id')
    //get inactive trips for an organizer
    .get(function (req, res) {
        Trip.find({ "isActive": false, organizerId: req.params.id }, function (err, trip) {
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

router.route("/inactiveAllDates")
    .post(function(req,res){
            let allDate = req.body.allDates
            let activeId = req.body.activeId

            for(let i = 0;i<allDate.length;i++){
                if(allDate[i].value == activeId){
                    allDate[i].active = !allDate[i].active
                }
            }

                // Trip.find({ _id : { $in : req.body.datesArray }}, function (err,trips) {
                //     if (err) {
                //         res.send(err)
                //     }
                    Trip.update({ _id : { $in : req.body.datesArray }}, { $set: {"booking.allDates":allDate} }, function (err) {
                        if (err) {
                            res.send(err)
                        }
                        res.json({ message: allDate })
                    });
    });


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

    .patch(function (req, res) {
        var query = {
            _id: req.params.userId
        };
        Users.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ success: "users list updated" })
        });
    })

    .get(function (req, res) {
        var query = {
            _id: req.params.userId
        }
        Users.findOne(query, function (err, user) {
            if (err) {
                res.send(err)
            }
            console.log("user : ", user)
            res.send(user)
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
                    user.password = null
                    res.json({ user })
                } else {
                    res.json({ "message": "incorrect password" })
                }
            } else {
                res.json({ "message": "username does not exist" })
            }
        });
    });

router.route('/checkUsername')
//to check if user exist
.post(function (req, res) {
    Organizer.findOne({
        username: req.body.username
    }, function (err, user) {
        if (user !== null) {
            res.json({ username: true })
        } else {
            res.json({ username : false })
        }
    })
});

router.route('/agent-login')
    //to check if user exist
    .post(function (req, res) {
        Organizer.findOne({
            username: req.body.username
        }, function (err, user) {
            if (user !== null) {
                if (req.body.password === user.password) {
                    user.password = null
                    res.json({ user })
                } else {
                    res.json({ "message": "incorrect password" })
                }
            } else {
                res.json({ "message": "username does not exist" })
            }
        })
    });

router.route('/changePassword-organizer/:id')

.patch(function (req, res) {
    var query = {
        _id: req.params.id
    };
    Organizer.findOne(query, function (err, user) {
        console.log("user : ", user)
        console.log("req.body : ", req.body)
        if (user.password !== req.body.currentPassword) {
            res.json({ error: "current password is incorrect" })
        } else {
            Organizer.update(query, {
                $set: {
                    password: req.body.newPassword
                }
            }, function (err) {
                if (err) {
                    res.send(err)
                }
                res.json({ success: "users list updated" })
            });
        }
    })
});

router.route('/changePassword/:id')

    .patch(function (req, res) {
        var query = {
            _id: req.params.id
        };
        Users.find(query, function (err, user) {
            console.log("user : ", user)
            console.log("req.body : ", req.body)
            if (user.password !== req.body.currentPassword) {
                res.json({ error: "current password is incorrect" })
            } else {
                Users.update(query, {
                    $set: {
                        password: req.body.newPassword
                    }
                }, function (err) {
                    if (err) {
                        res.send(err)
                    }
                    res.json({ success: "users list updated" })
                });
            }
        })
    });

router.route('/places/:name')
    .get(function (req, res) {
        Trip.find({ place: { $all: [req.params.name] } }, function (err, trip) {
            if (err) {
                res.send(err)
            } else {
                let city = ["ALL"]
                for (let i = 0; i < trip.length; i++) {
                    city.push(trip[i].booking.departureCity)
                }
                var city1 = [...new Set(city)]
                if (req.query.departure === "ALL") {
                    res.json({
                        trips: trip,
                        search: city1,
                        selected: "ALL"
                    })
                } else {
                    res.json({
                        trips: trip.filter(ele => ele.booking.departureCity === req.query.departure),
                        search: city1,
                        selected: req.query.departure
                    })
                }
            }
        })
    });

router.route('/places')
    .get(function (req, res) {
        Places.find({}, { title: 1 }, function (err, place) {
            if (err) {
                res.send(err)
            }
            res.send(place)
        });
    });

router.route('/placesSearch')
    .get(function (req, res) {
        Trip.find({}, { place: 1 }, function (err, places) {
            if (err) {
                res.send(err)
            } else {
                let arr = [];
                for (let i = 0; i < places.length; i++) {
                    arr.push(places[i].place)
                }
                var temp = arr.reduce((r, e) => (r.push(...e), r), [])
                var uniqueArray = [...new Set(temp)];
                res.send(uniqueArray)
            }
        });
    });

router.route('/videos/:type')
    .get(function (req, res) {
        Videos.find({ tags: { $all: [req.params.type] } }, function (err, video) {
            if (err) {
                res.send(err)
            }
            res.send(video)
        });
    });

router.route('/trips/:tripsArray')
    //4
    //to get details of multiple trips by ids
    .get(function (req, res) {
        Trip.find({ "_id": { $in: JSON.parse(req.params.tripsArray) } }, function (err, trips) {
            if (err) {
                res.send(err)
            } else {
                res.send(trips)
            }
        });
    });

router.route('/videos')
    .get(function (req, res) {
        Videos.find({}, function (err, video) {
            if (err) {
                res.send(err)
            }
            res.send(video)
        });
    });

router.route('/home/:userId')
    .get(function (req, res) {
        Category.find({}, function (err, category) {
            if (err) {
                res.send(err)
            } else {
                for (let i = 0; i < category.length; i++) {
                    if (category[i].followers.includes(req.params.userId)) {
                        category[i].isFollowed = true
                        category[i].followers = []
                    } else {
                        category[i].isFollowed = false
                        category[i].followers = []
                    }
                }
                category1 = category.filter(function (item) {
                    return item.isFollowed;
                });

                category2 = category.filter(function (item) {
                    return !item.isFollowed;
                });

                res.send(category1.concat(category2))
            }
        });
    });

router.route('/followStyle')
    .post(function (req, res) {
        var category = new Category();

        category.user = req.body.userId;
        category.categoryId = req.body.categoryId;

        if (req.body.followed === "true") {
            Category.update({ _id: req.body.categoryId }, { $pull: { "followers": req.body.userId } }, function (err, category) {
                if (err) {
                    res.send(err)
                } else {
                    res.send("category unfollowed")
                }
            });
        } else {
            Category.update({ _id: req.body.categoryId }, { $push: { "followers": req.body.userId } }, function (err, category) {
                if (err) {
                    res.send(err)
                } else {
                    res.send("category followed")
                }
            });
        }

    });

app.listen(port);


console.log("working at port : ", port)





