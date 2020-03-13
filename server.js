var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Trip = require('./app/models/trips');
var Cart = require("./app/models/cart")
var Organizer = require('./app/models/organizers');
var Customer = require('./app/models/customers');
var Users = require("./app/models/users");
var TeeOrder = require("./app/models/teeOrder")
var Places = require("./app/models/places");
var Gift = require("./app/models/gift")
var Reviews = require("./app/models/reviews")
var Organizerstats = require("./app/models/organizerstats")
var UpcomingTrips = require("./app/models/upcomingTrips")
var Category = require("./app/models/category")
var Shop = require("./app/models/shop")
var Tripreviews = require("./app/models/tripReview")
var Pendingreview = require("./app/models/pendingReview")
var cors = require('cors');
var AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
var Templates = require('./templates/forgotPassword');


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

//to test if the api is working
router.get('/', function (req, res) {
    res.json({ message: "Welcome to trippospace" });
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Buckets);
        }
    });
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


// ORGANIZER APP API

router.route('/trip')
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
        trip.images = req.body.images;
        trip.reviews = req.body.reviews;
        trip.place = req.body.place;
        trip.organizer = req.body.organizer;
        trip.booking = req.body.booking;
        trip.date = req.body.date;
        trip.partialPay = req.body.partialPay;
        trip.tripTypes = req.body.tripTypes;
        trip.itinerary = req.body.itinerary;
        trip.pickup = req.body.pickup;
        trip.inclusions = req.body.inclusions;
        trip.exclusions = req.body.exclusions;
        trip.credits = req.body.credits;
        trip.organizerId = req.body.organizerId;
        trip.organizerName = req.body.organizerName;
        trip.terms = req.body.terms;
        trip.cancellationPolicy = req.body.cancellationPolicy
        trip.thingsToCarry = req.body.thingsToCarry
        trip.notes = req.body.notes
        trip.save(function (err, response) {
            if (err) {
                res.send(err)
            } else {
                res.send(response)
            }
        });
    })

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

router.route('/shop')
    //to get details of all the shop items
    .get(function (req, res) {
        Shop.find({},function (err, items) {
            if (err) {
                res.send(err)
            }
            res.send(items)
        });
    });

router.route('/shop/:id')
    //to get details of all the shop items
    .get(function (req, res) {
        var query = {_id:req.params.id};
        Shop.findOne(query, function (err, item) {
            if (err) {
                res.send(err)
            }
            res.send(item)
        });
    });

router.route('/cash/:id')
    //to get details of all the shop items
    .get(function (req, res) {
        var query = {_id:req.params.id};
        Users.findOne(query, function (err, user) {
            if (err) {
                res.send(err)
            }
            res.send(user.stats)
        });
    });

router.route('/shop-notification')
    .post(function (req, res) {
        Templates.ShopNotification(req)
        .then(response=>{
            res.json(response)
        })
    })

router.route('/booking-notification')
    .post(function (req, res) {
        Templates.BookNotification(req)
        .then(response => {
            const accountSid = 'AC1220e63355a01554295600675b52dad7'; 
            const authToken = '755518f7a6b6a99131fd4bb1c5d9d940'; 
            const client = require('twilio')(accountSid, authToken); 
    
    client.messages 
        .create({ 
            body : `new trip booking`,
            from: 'whatsapp:+14155238886',       
            to: 'whatsapp:+918971780778' 
        }) 
        .then(message => res.send(message.sid)) 
        .done();
    })        
});   

router.route('/send-otp')
    .post(function (req, res) {

    const accountSid = 'AC1220e63355a01554295600675b52dad7'; 
    const authToken = '755518f7a6b6a99131fd4bb1c5d9d940'; 
    const client = require('twilio')(accountSid, authToken); 
    
    client.verify.services('VA744845fc17abd7ed3d9e54547cf76edf')
        .verifications
        .create({to: req.body.phone, channel: 'sms'})
        .then(verification => res.send(verification.status));
    })

router.route('/verify-otp')
    .post(function (req, res) {

    const accountSid = 'AC1220e63355a01554295600675b52dad7'; 
    const authToken = '755518f7a6b6a99131fd4bb1c5d9d940'; 
    const client = require('twilio')(accountSid, authToken); 
    
    client.verify.services('VA744845fc17abd7ed3d9e54547cf76edf')
        .verificationChecks
        .create({to: req.body.phone, code: req.body.code})
        .then(verification_check => res.send(verification_check.status));
    })

router.route('/trip/:tripid')
    //to get details of a trip by tripId
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

    //to delete a trip by tripId
    .delete(function (req, res) {
        var query = {
            _id: req.params.tripid
        };
        Trip.deleteOne(query, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({message:"trip deleted succesfully"})
        });
    })
    
    //to edit a trip by tripId
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


router.route('/multi-trip/:tripsArray')
    .patch(function (req, res) {
        Trip.update({ "_id": { $in: JSON.parse(req.params.tripsArray) } }, { $set: req.body }, { multi:true } , function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "trip data updated" })
        });
    });

router.route('/tripCategory/:category')

    //to get details of a trip by tipId
    .get(function (req, res) {
        Trip.find({ tags: { $all: [req.params.category] }, isActive:true }, function (err, trip) {
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


router.route('/gift')

    //to add a new gift card
    .post(function (req, res) {
        var gift = new Gift();
        gift.code = req.body.code,
        gift.value = req.body.value,
        gift.redeemed = false
        gift.save(function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: "gift card created succesfully" })
        });
    });

router.route('/gift/:code')
    //to add a new gift card
    .get(function (req, res) {
        Gift.findOne({code:req.params.code},function (err, card) {
            if (err) {
                res.send(err)
            }else{
                if(card === null){
                    res.json({error:"INVALID CODE"})
                }else{
                    if(card.redeemed){
                        res.json({error:"CODE ALREADY REDEEMED"})
                    }else{
                        Gift.updateOne({code:req.params.code},{$set : {redeemed:true}},function (err, status) {
                            if (err) {
                                res.send(err)
                            }else{
                                res.json({value: card.value})
                            }
                        })
                    }
                } 
            }
        });
    });

router.route('/organizer')

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

router.route('/teeOrder')
    //to post a new trip
    .post(function (req, res) {
        var tee = new TeeOrder();
        tee.dateOfPurchase = req.body.dateOfPurchase,
        tee.delivered = req.body.delivered
        tee.waybill = req.body.waybill
        tee.orderId = req.body.orderId
        tee.refnum = req.body.refnum
        tee.title = req.body.title
        tee.price = req.body.price
        tee.thumb = req.body.thumb
        tee.color = req.body.color
        tee.colorCode = req.body.colorCode
        tee.size = req.body.size
        tee.userId = req.body.userId
        tee.quantity = req.body.quantity
        tee.save(function (err, response) {
            if (err) {
                res.send(err)
            } else {
                res.send(response._id)
            }
        });
    })

router.route('/teeOrder/:id')
    .get(function (req, res) {
        TeeOrder.find({ userId: req.params.id }, function (err, orders) {
            if (err) {
                res.send(err)
            }
            res.send(orders)
        });
    })

router.route('/cart')
    //to post a new trip
    .post(function (req, res) {
        var cart = new Cart();
        cart.productId = req.body.productId,
        cart.title = req.body.title,
        cart.price = req.body.price
        cart.thumb = req.body.thumb
        cart.color = req.body.color
        cart.size = req.body.size
        cart.userId = req.body.userId
        cart.quantity = 1
        cart.save(function (err, response) {
            if (err) {
                res.send(err)
            } else {
                res.send(response._id)
            }
        });
    })

router.route('/cart/:id')
    .get(function (req, res) {
        Cart.find({ userId: req.params.id }, function (err, item) {
            if (err) {
                res.send(err)
            }
            res.send(item)
        });
    })

router.route('/cart/:id')
    .delete(function (req, res) {
        Cart.deleteOne({ _id: req.params.id }, function (err, response) {
            if (err) {
                res.send(err)
            }
            res.send(response)
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

router.route('/updateCategory')
    //get inactive trips for an organizer
    .post(function (req, res) {
        let query = {
            id: { $in : req.body.tags}
        }
        let action = req.body.action

        Category.find(query, function (err, categories) {
            if (err) {
                res.send(err)
            }
            for(let i = 0; i < categories.length; i++){
                Category.update({id:categories[i].id},{$set : {trips : categories[i].trips+action }}, function (err, status){
                    if (err) {
                        res.send(err)
                    }
                    if(i === categories.length-1 ){
                        res.send("categories updated")
                    }
                });
            }
        });
    })


router.route('/inactive')
    //active or inactive a trip
    .post(function (req, res) {

        const updateDates = (date) => {
            for(let i = 0;i<date.length;i++){
                if(date[i].value == req.body.tripId){
                    if(req.body.type === "inactive"){
                        date[i].active = !date[i].active
                    }else if(req.body.type === "delete"){
                        date.splice(i, 1);
                    }   
                }
            }
            return date;
        }
        
        Trip.update({_id: req.body.tripId}, { $set: req.body.isActive }, function (err) {
            if (err) {
                res.send(err)
            }
           
            Trip.update({ _id : { $in : req.body.datesArray }}, { $set: {"booking.allDates":req.body.type === "addNewDate" ? req.body.allDates : updateDates(req.body.allDates)} }, {multi: true} , function (err) {
                if (err) {
                    res.send(err)
                }
                res.json({ message: "all dates updated" })
            });
        });
                
    });

router.route("/inactiveAllDates")
    .post(function(req,res){
            let allDate = req.body.allDates
            let activeId = req.body.activeId

            const updateDates = (date) => {
                for(let i = 0;i<date.length;i++){
                    if(date[i].value == activeId){
                        if(req.body.type === "inactive"){
                            date[i].active = !date[i].active
                        }else if(req.body.type === "delete"){
                            date.splice(i, 1);
                        }   
                    }
                }
                return date;
            }

            Trip.update({ _id : { $in : req.body.datesArray }}, { $set: {"booking.allDates":req.body.type === "addNewDate" ? allDate : updateDates(allDate)} }, {multi: true} , function (err) {
                if (err) {
                    res.send(err)
                }
                res.json({ message: "all dates updated" })
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

router.route('/referal')
    //to add a new organizer
    .post(function (req, res) {
        Users.findOne({referalCode:req.body.code}, function (err, user) {
           if(user === null){
                res.send("invalid referal code")
           }else{
            Users.updateOne({referalCode:req.body.code}, {$set : {"stats.credits" : user.stats.credits+200}}, function (err, response) {
                res.send("referal successful")
            });
           }
        });
    })

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

router.route('/complete-trip')
    .post(function (req, res) {
        var pendingreview = new Pendingreview();
        pendingreview.tripDetails = req.body.tripDetails,
        pendingreview.user = req.body.user
        pendingreview.save(function (err, response) {
            if (err) {
                res.send(err)
            }
            UpcomingTrips.deleteOne({ _id: req.body._id }, function (err, trip) {
                if (err) {
                    res.send(err)
                } else {
                    res.send(response._id)
                }
            });
        });
    });

//get Reviews for organizer
router.route('/getReviews/:id')
    .get(function (req, res) {
    Reviews.find({ organizer : req.params.id }, function (err, review) {
        if (err) {
            res.send(err)
        }
        res.send(review)
    });
});

router.route('/organizer-review')
.post(function (req, res) {
    var reviews = new Reviews();
    reviews.name = req.body.name
    reviews.id = req.body.id,
    reviews.trip = req.body.trip,
    reviews.tripDate = req.body.tripDate,
    reviews.rating = req.body.rating,
    reviews.review = req.body.review,
    reviews.organizer = req.body.organizerId
    reviews.save(function (err, response) {
        if (err) {
            res.send(err)
        }
        res.send({ "id": response })
    });
});

router.route('/organizer-review/:id')

    .patch(function (req, res) {
        var query = {
            _id: req.params.id
        };
        Reviews.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ success: "review updated" })
        });
    });

router.route('/trip-review/:id')
    .patch(function (req, res) {
        var query = {
            _id: req.params.id
        };
        Tripreviews.update(query, { $set: req.body }, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ success: "review updated" })
        });
    });

router.route('/trip-review')
.post(function (req, res) {
    var tripreviews = new Tripreviews();
    tripreviews.name = req.body.name,
    tripreviews.id = req.body.id,
    tripreviews.thumb = req.body.thumb,
    tripreviews.rating = req.body.rating,
    tripreviews.tripDate = req.body.tripDate,
    tripreviews.review = req.body.review,
    tripreviews.images = req.body.images,
    tripreviews.organizerName = req.body.organizerName,
    tripreviews.organizerId = req.body.organizerId,
    tripreviews.tripTitle = req.body.tripTitle,
    tripreviews.days = req.body.days
    tripreviews.date = req.body.date
    tripreviews.save(function (err, response) {
        if (err) {
            res.send(err)
        }
        Pendingreview.deleteOne({ _id: req.body.pendingId }, function (err, trip) {
            if (err) {
                res.send(err)
            } else {
                res.send(response._id)
            }
        });
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
        users.stats = req.body.stats;
        users.referalCode = req.body.referalCode;
        users.social = req.body.social
        users.save(function (err, trip) {
            if (err) {
                res.send(err)
            }
            res.json({ "success": "user added succesfully : " + trip._id })
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

router.route('/checkOrganizerid')
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

router.route('/checkUsername')
//to check if user exist
    .post(function (req, res) {
        Users.findOne({
            username: req.body.username
        }, function (err, user) {
            console.log("query :", req.body.username)
            console.log("user :", user)
            if (user !== null) {
                res.json({ username: true })
            } else {
                res.json({ username : false })
            }
        })
    });

router.route('/checkEmail')
//to check if user exist
    .post(function (req, res) {
        Users.findOne({
            email: req.body.email
        }, function (err, user) {
            if (user !== null) {
                res.json({ email: true })
            } else {
                res.json({ email : false })
            }
        })
    });

router.route('/checkPhone')
//to check if user exist
    .post(function (req, res) {
        Users.findOne({
            phone: req.body.phone
        }, function (err, user) {
            if (user !== null) {
                res.json({ phone: true })
            } else {
                res.json({ phone : false })
            }
        })
    });

router.route('/reset-password')
//to reset forgotten password
    .post(function (req, res) {
        Templates.ForgotPassword(req,Users,Organizer)
        .then(response=>{
            res.json(response)
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

router.route('/phone-auth')
    //to check if user exist
    .post(function (req, res) {
        // const Nexmo = require('nexmo');

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const code = otp.substr(0,4)

        // const nexmo = new Nexmo({
        //     apiKey: 'b21324c1',
        //     apiSecret: 'IlE5PM4MZYZLsTOO',
        // });

        // const from = 'TRIPPOSPACE';
        // const to = req.body.phone;
        // const text = `your verification code is ${code}`;

        // nexmo.message.sendSms(from, to, text);

        const accountSid = 'AC1220e63355a01554295600675b52dad7';
        const authToken = '755518f7a6b6a99131fd4bb1c5d9d940';
        const client = require('twilio')(accountSid, authToken);

        client.messages
        .create({
            body: `your verification code is ${code}`,
            from: '+15017122661',
            to: '918971780778'
        })
        .then(message => console.log("message.sid : ",message.sid));

        res.json({ "code": code})
    });

router.route('/welcome-mail')
    //to check if user exist
    .post(function (req, res) {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey("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");
        
        const msg = {
            to: req.body.mail,
            from: 'welcome@trippospace.com',
            subject: 'WELCOME TO TRIPPOSPACE COMMUNITY',
            text: 'grow your business with trippospace',
            html: `<body class="iOSGmailAppfix" style="margin:0; padding:0; background-color:#F2F2F2;">
            <table id="EmailWrapper" cellpadding="0" cellspacing="0" border="0" align="center"
            style="background-color: #f2f2f2; border:none; font-size: 0; width:100%">
              <tr>
                <td class="topCell" style="text-align: center;">
                  <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:inherit; max-width: 640px; display: inline-table;"
                  border="0" align="center" width="640">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:100%; background:#fff; table-layout: fixed;"
                        border="0" align="center">
                          <tr>
                            <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:20px 25px;">TRIPPOSPACE COMMUNITY</td>
                          </tr>
                          <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">welcome to trippospace community. our team will contact you soon for further procedure.</td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 15px 20px 15px; text-align: center;">
                              
                            </td>
                          </tr>
                        </table>
                       </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="font-size:0; width:300px;">
              <tr>
                <td style="width:20%;">
                    <a href="https://www.facebook.com/trippospace/"
                    target="_blank">
                    <img src="https://cdn-s3.touchofmodern.com/email/social-icon-facebook.png" width="22"
                    height="22" alt="Facebook"/>
                    </a>
                </td>
                <td style="width:20%;">
                    <a href="https://www.instagram.com/trippospace/"
                    target="_blank">
                    <img src="https://cdn-s3.touchofmodern.com/email/social-icon-instagram.png" width="22"
                    height="22" alt="Instagram"/>
                    </a>
                </td>
                <td style="width:20%;">
                    <a href="https://www.youtube.com/channel/UCNHrjKwSe-JSe2o9EKyZZmQ?view_as=subscriber" target="_blank">
                    <img src="https://cdn-s3.touchofmodern.com/doorbuster/yt.png" width="22" height="22"
                    alt="Youtube"/>
                    </a>
                </td>
                <td style="width:20%;">
                    <a href="https://twitter.com/trippospace"
                    target="_blank">
                    <img src="https://cdn-s3.touchofmodern.com/email/social-icon-twitter.png" width="22"
                    height="22" alt="Twitter"/>
                    </a>
                </td>
              </tr>
            </table>     
          </body>`,
          };

          sgMail.send(msg);
        res.send({ "message":"email sent" })
    });


router.route('/changePassword-organizer/:id')

.patch(function (req, res) {
    var query = {
        _id: req.params.id
    };
    Organizer.findOne(query, function (err, user) {
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
        Users.findOne(query, function (err, user) {

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
        Trip.find({ place: { $all: [req.params.name] }, isActive:true }, function (err, trip) {
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

router.route('/reviews/:array')
    //4
    //to get details of multiple trips by ids
    .get(function (req, res) {
        Tripreviews.find({ "_id": { $in: JSON.parse(req.params.array) } }, function (err, reviews) {
            if (err) {
                res.send(err)
            } else {
                res.send(reviews)
            }
        });
    });

router.route('/upcomingTrips/:id')
    //4
    //to get details of multiple trips by ids
    .get(function (req, res) {
        UpcomingTrips.find({ userId : req.params.id }, function (err, trips) {
            if (err) {
                res.send(err)
            } else {
                res.send(trips)
            }
        });
    });

router.route('/check-upcoming-trip')
    .get(function (req, res) {
        UpcomingTrips.find({ userId : req.query.u, tripId:req.query.t }, function (err, trip) {
        if (err) {
            res.send(err)
        }
        if(trip === null ){
            res.send(false)
        }
        res.send(trip)
    });
});

router.route('/upcoming-trip/:id')
    .patch(function (req, res) {
        UpcomingTrips.update({ _id :req.params.id },{$set : req.body }, function (err, trip) {
        if (err) {
            res.send(err)
        }
        res.send(trip)
    });
});

router.route('/completed-trip/:id')
    .get(function (req, res) {
        Tripreviews.findOne({ _id :req.params.id }, function (err, trip) {
        if (err) {
            res.send(err)
        }
        res.send(trip)
    });
});

router.route('/completedTrips/:id')
    //4
    //to get details of multiple trips by ids
    .get(function (req, res) {
        Tripreviews.find({ id : req.params.id }, function (err, trips) {
            if (err) {
                res.send(err)
            } else {
                res.send(trips)
            }
        });
    });

router.route('/stats/:id')
    //4
    //to get details of multiple trips by ids
    .get(function (req, res) {
        Organizerstats.findOne({ organizerId : req.params.id }, function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        });
    })

    .patch(function (req, res) {
        Organizerstats.update({ organizerId : req.params.id }, {$set : req.body}, function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        });
    })

router.route('/stats')
    //4
    //to get details of multiple trips by ids
    .get(function (req, res) {
        Organizerstats.find({},{ trips:0, organizerName:0, organizerId:0,_id:0 },function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
    });

router.route('/pendingTrips/:id')
    //4
    //to get details of multiple trips by ids
    .get(function (req, res) {
        Pendingreview.find({ user : req.params.id }, function (err, trips) {
            if (err) {
                res.send(err)
            } else {
                res.send(trips)
            }
        });
    });

router.route('/upcomingtrip')
    //to post a new trip
    .post(function (req, res) {
        var upcomingtrips = new UpcomingTrips();
        upcomingtrips.tripTitle = req.body.tripTitle;
        upcomingtrips.thumb = req.body.thumb;
        upcomingtrips.tripId = req.body.tripId
        upcomingtrips.travelers = req.body.travelers
        upcomingtrips.credits = req.body.credits
        upcomingtrips.date = req.body.date
        upcomingtrips.days = req.body.days
        upcomingtrips.userId = req.body.userId
        upcomingtrips.travelers = req.body.travelers,
        upcomingtrips.price = req.body.price
      
        upcomingtrips.save(function (err, response) {
            if (err) {
                res.send(err)
            } else {
                res.send(response)
            }
        });
    })

router.route('/home/:userId')
    .get(function (req, res) {
        Category.find({}, function (err, category) {
            if (err) {
                res.send(err)
            } 
            res.send(category)
        });
    });

app.listen(port);


console.log("working at port : ", port)





