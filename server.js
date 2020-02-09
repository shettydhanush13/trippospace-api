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
var Reviews = require("./app/models/reviews")
var CompletedTripsData = require("./app/models/completedTrips")
var Category = require("./app/models/category")
var cors = require('cors');
var AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const Nexmo = require('nexmo');
var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

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
                Category.update({ id: { $in : req.body.tags} }, { $push: { "trips": {id:response._id.toString() ,active:true}} }, {multi:true}, function (err, category) {
                    if (err) {
                        res.send(err)
                    } else {
                        Organizer.update({ _id:  req.body.organizerId }, { $push: { "trips": {id:response._id.toString() ,active:true} }}, function (err, organizer) {
                            if (err) {
                                res.send(err)
                            } else {
                                res.send(response._id)
                            }
                        });
                    }
                });
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
            res.json({message:"trip deleted succesfully"})
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

router.route('/inactive')
    //active or inactive a trip
    .post(function (req, res) {

        const updateTrips = (trip) => {
            for(let i = 0 ; i < trip.length; i++){
                if(trip[i].id === req.body.tripId ){
                    trip[i].active = !trip[i].active
                }
            }
            return trip
        }

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
            Organizer.findOne( {_id: req.body.organizerId} , function (error,organizer) {
                if (error) {
                    res.send(error)
                }
                Organizer.update( {_id: req.body.organizerId} ,{$set : {"trips": updateTrips(organizer.trips)}}, function (error,organizer2) {
                    if (error) {
                        res.send(error)
                    }
                    Category.find({ id: { $in : req.body.tags} }, function (err, category) {
                        if (err) {
                            res.send(err)
                        } 
                        for(let i = 0 ; i < category.length; i++){
                            Category.update({ id: category[i].id },{$set:{ "trips" :  req.body.isActive.isActive ? category[i].trips+1 : category[i].trips-1 }}, function (err, category2) {
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
                        } 
                    });
                });
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

//get Reviews for organizer
router.route('/reviews')
    .post(function (req, res) {
    Reviews.find({_id : { $in : req.body.reviewId }}, function (err, review) {
        if (err) {
            res.send(err)
        }
        console.log("review : ", review)
        res.send(review)
    });
});

//get completed trips data
router.route('/completedTripsData/:id')
    .get(function (req, res) {
    CompletedTripsData.findOne({"organizerId" : req.params.id.toString()}, function (err, data) {
        if (err) {
            res.send(err)
        }
        res.send(data)
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
        console.log("username : ",req.body.username)
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
        const Nexmo = require('nexmo');

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const code = otp.substr(0,4)

        const nexmo = new Nexmo({
            apiKey: 'b21324c1',
            apiSecret: 'IlE5PM4MZYZLsTOO',
        });

        const from = 'TRIPPOSPACE';
        const to = req.body.phone;
        const text = `your verification code is ${code}`;

        // nexmo.message.sendSms(from, to, text);

        const msg = {
            to: 'shettydhanush13@gmail.com',
            from: 'donotreply@trippospace.com',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
            <html>
            <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
                <link href="https://fonts.googleapis.com/css?family=Lato:400,300,700,400italic" rel="stylesheet" type="text/css" />
                <title>Educents Welcome Email Template</title>
                <style type="text/css">/*Hotmail and Yahoo specific code*/
            
            .ReadMsgBody {
                width: 100%;
            }
            .ExternalClass {
                width: 100%;
            }
            .yshortcuts {
                color: #ffffff;
            }
            .yshortcuts a span {
                color: #ffffff;
                border-bottom: none !important;
                background: none !important;
            }
            /*Hotmail and Yahoo specific code*/
            body {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                -webkit-font-smoothing: antialiased;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }
            p {
                margin: 0px !important;
                padding: 0px !important;
            }
            th {
                font-weight: normal !important;
            }
            .appleLinks a {
                color: #e3e3f1 !important;
                text-decoration: none !important;
            }
            .button-container {
                margin: 0 auto !important;
                width: 60% !important;
            }
            /* mouse over link title */
            .titletxt {
                color: #616161;
                text-decoration: none;
            }
            .titletxt:hover {
                color: #545454;
                text-decoration: none;
            }
            /* mouse over link cta */
            /*-----Mobile specific code------*/
             @media only screen and (max-width:799px) {
            body {
                width: auto !important;
            }
            table[class="main"] {
                max-width: 480px !important;
                width: 100% !important;
            }
            img[class="img1"] {
                max-width: 150px !important;
                width: 100% !important;
                height: auto;
                display: block;
                margin: 0 auto;
            }
            img[class="img2"] {
                max-width: 100% !important;
                width: 100% !important;
                height: auto;
                display: block;
                margin: 0 auto;
            }
            img[class="banner"] {
                max-width: 100% !important;
                width: 100% !important;
                height: auto;
                display: block;
                margin: 0 auto;
            }
            img[class="spacerimg"] {
                max-width: 0px !important;
                width: 0px !important;
                display: none !important;
            }
            th[class="stack1"] {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                text-align: center !important;
            }
            th[class="stack2"] {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                margin-top: 15px !important;
            }
            th[class="sphide"] {
                display: none !important;
                width: 0px;
            }
            td[class="textcntr"] {
                text-align: center !important;
                padding-left: 10px;
                padding-right: 10px;
            }
            td[class="button"] {
                max-width: 180px !important;
                width: 180px !important;
                display: block;
                margin: 0 auto;
                background-color: #faad47;
                border-radius: 2px;
                -moz-border-radius: 2px;
                -webkit-border-radius: 2px;
            }
            td[class="hspace"] {
                height: 25px !important;
            }
            }
             @media only screen and (max-width: 479px) {
            body {
                width: auto !important;
            }
            table[class="main"] {
                max-width: 320px !important;
                width: 100% !important;
            }
            img[class="img1"] {
                max-width: 150px !important;
                height: auto;
                display: block;
                margin: 0 auto;
            }
            th[class="sphide22"] {
                display: none !important;
                width: 0px;
            }
            td[class="titlefsize"] {
                font-size: 20px !important;
                text-align: center !important;
            }
            td[class="wspacw"] {
                width: 6px !important;
            }
            th[class="midspacw"] {
                width: 8px !important;
            }
            td[class="textcntr"] {
                text-align: center !important;
            }
            table[class="logo_left"] {
                max-width: 100%;
                width: 100% !important;
                height: auto;
                margin: 0 auto;
                text-align: center !important;
            }
            img[class="logo_center"] {
                display: inherit !important;
            }
            td[class="cta1"] {
                max-width: 100% !important;
                width: 100% !important;
                background-color: #ffffff;
                border-radius: 2px;
                -moz-border-radius: 2px;
                -webkit-border-radius: 2px;
            }
            td[class="cta"] {
                max-width: 100% !important;
                width: 100% !important;
                background-color: #faad47;
                border-radius: 2px;
                -moz-border-radius: 2px;
                -webkit-border-radius: 2px;
            }
            img[class="spacerimg"] {
                max-width: 0px !important;
                width: 0px !important;
                display: none !important;
            }
            }
            /*-----Mobile specific code end------*/
                </style>
            </head>
            <body bgcolor="#F7F7F7" style="margin:0px;">
            <table bgcolor="#F7F7F7" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                    <tr>
                        <td align="center">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="main" width="600">
                            <tbody>
                                <tr>
                                    <td><span style="color:#F8F8F8;"><font face="Lato, Arial, sans-serif, Trebuchet MS"><span style="font-size: 12px; line-height: 15px;">Welcome to the Educents Community. Discover New Ways to Keep Kids Excited About Learning.</span></font></span></td>
                                </tr>
                                <tr>
                                    <td valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td bgcolor="#FFFFFF">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td width="28">&nbsp;</td>
                                                            <td>
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td height="28">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left">
                                                                        <table border="0" cellpadding="0" cellspacing="0" class="logo_left">
                                                                            <tbody>
                                                                                
                                                                            </tbody>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                    </tr>
                                                                    <tr>
                                                                    
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="15">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            </td>
                                                            <td width="28">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                </td>
                                            </tr>
                                            
                                            <tr>
                                                <td bgcolor="#FFFFFF">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td class="wspacw" width="35">&nbsp;</td>
                                                            <td>
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-family:Lato, Arial, sans-serif, Trebuchet MS; font-size:26px; line-height:32px; color:#17B9AC; text-align:center; font-weight:700;">Welcome to the Trippospace Community</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="12">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <!-- <td style="font-family:Lato, Arial, sans-serif, Trebuchet MS; font-size:22px; line-height:26px; color:#616161; text-align: center;">Save an <span style=" font-size:24px; font-weight:bold;">EXTRA 15% off</span>&nbsp;on your first purchase!</td> -->
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="5">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-family:Lato, Arial, sans-serif, Trebuchet MS; font-size:14px; line-height:24px; color:#616161; text-align: center;">WELCOME TO TRIPPOSPACE TRAVEL COMMUNITY. OUR TEAM WILL CONTACT YOU SHORTLY ON FURTHER PROCEDURE TO ABOARD OUT PLATFORM</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="15">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center">
                                                                    
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="5">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            </td>
                                                            <td class="wspacw" width="35">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                </td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <td>
                                    
                                    </td>
                                </tr> -->
                                <tr>
                                    <td valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td width="28">&nbsp;</td>
                                                <td>
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                        </tr>
                                                        <tr>
                                                        </tr>
                                                        <tr>
                                                            <td class="textcntr" style="font-family: Lato, Arial, sans-serif, &quot;Trebuchet MS&quot;; font-size: 15px; line-height: 25px; color: rgb(97, 97, 97); font-weight: 700; text-align: center;">Follow us on social media&nbsp;</td>
                                                            <td height="36">&nbsp;</td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center">
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%2220%22%2C%22height%22%3A%2220%22%2C%22alt_text%22%3A%22facebook%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/710a18cd99ba36db34412b55ff649c56add28b997b1c1b9e03ebf4f420874acdaade97c0c513dec89e5756b08854791b3e853867ed2ea918fdf19b3e9487b783.png%22%2C%22link%22%3A%22https%3A//www.facebook.com/educents%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><a href="https://www.facebook.com/trippospace-436674613454047" target="_blank"><img alt="facebook" border="0" height="20" src="https://marketing-image-production.s3.amazonaws.com/uploads/710a18cd99ba36db34412b55ff649c56add28b997b1c1b9e03ebf4f420874acdaade97c0c513dec89e5756b08854791b3e853867ed2ea918fdf19b3e9487b783.png" style="width: 20px; height: 20px;" width="20" /></a></span></td>
                                                                        <td width="25">&nbsp;</td>
                                                                        <td><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%2220%22%2C%22height%22%3A%2220%22%2C%22alt_text%22%3A%22twitter%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/b74a9cd00a7456db4b0d8eaa72cd27c3280272e378aaf57b24534a8af463984d6d27b1ea9a821397b0e1a7fada0335b0c7ff578948d5d9868630a522cf193ac8.png%22%2C%22link%22%3A%22https%3A//twitter.com/educents%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><a href="https://twitter.com/trippospace" target="_blank"><img alt="twitter" border="0" height="20" src="https://marketing-image-production.s3.amazonaws.com/uploads/b74a9cd00a7456db4b0d8eaa72cd27c3280272e378aaf57b24534a8af463984d6d27b1ea9a821397b0e1a7fada0335b0c7ff578948d5d9868630a522cf193ac8.png" style="width: 20px; height: 20px;" width="20" /></a></span></td>
                                                                        <td width="25">&nbsp;</td>
                                                                        
                                                                        <td><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%2221%22%2C%22height%22%3A%2221%22%2C%22alt_text%22%3A%22instagram%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/fdd5cd004b13fe1f2c8869a9530f63eaf64c803710b6d3e6000ce70a6a4726d51b2f65a975a59615983fd092f76b76f37950c28df3e69e5de2cd4615064f8955.png%22%2C%22link%22%3A%22http%3A//instagram.com/educents%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><a href="http://instagram.com/trippospace
            " target="_blank"><img alt="instagram" border="0" height="21" src="https://marketing-image-production.s3.amazonaws.com/uploads/fdd5cd004b13fe1f2c8869a9530f63eaf64c803710b6d3e6000ce70a6a4726d51b2f65a975a59615983fd092f76b76f37950c28df3e69e5de2cd4615064f8955.png" style="width: 21px; height: 21px;" width="21" /></a></span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="36">&nbsp;</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family:Helvetica, Arial, sans-serif, Trebuchet MS; font-size:12px; line-height:18px; color:#616161; text-align: center;"><em><br />
                                                            <br />
                                                            Trippospace travel solutions pvt tld, 3rd a cross, bellandur, bengaluru - 560103</em></td>
                                                        </tr>
                                                        <tr>
                                                            <td height="15">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                </td>
                                                <td width="28">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            </body>
            </html>
            `,
          };
          sgMail.send(msg);

        res.json({ "code": code })
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
        Users.findOne(query, function (err, user) {
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





