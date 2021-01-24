const express = require('express');
const app = express();

const { config } = require("./src/config")
const { logConfig, mongoConfig } = config

//Import cron functions to initiate cron
const { bookmarkInfo } = require('./src/cronJobs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}))

const log4js = require('log4js');
log4js.configure(logConfig);

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(mongoConfig.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

const path = require('path');
app.use(express.static(path.join(__dirname,'public')))

app.use('/api/trip', require('./src/controllers/tripCRUD'))

app.use('/api/auth', require('./src/controllers/Auth'))

app.use('/api/tripCategory', require('./src/controllers/category'))

app.use('/api/my-trips', require('./src/controllers/completedTripCRUD'))

app.use('/api/shopping', require('./src/controllers/shoppingItemsData'))

app.use('/api/multi-trip', require('./src/controllers/MutipleTripsUpdate'))

app.use('/api/from', require('./src/controllers/getTripFromDepartureCity'))

app.use('/api/gift', require('./src/controllers/giftCard'))

app.use('/api/organizer', require('./src/controllers/organizerCRUD'))

app.use('/api/payouts', require('./src/controllers/payouts'))

app.use('/api/teeOrder', require('./src/controllers/teeOrder'))

app.use('/api/cart', require('./src/controllers/cartData'))

app.use('/api/inactive', require('./src/controllers/getInactiveTrips'))

app.use('/api/bookmark', require('./src/controllers/bookmarkTrip'))

app.use('/api/customer', require('./src/controllers/customerMaintenance'))

app.use('/api/user', require('./src/controllers/userCRUD'))

app.use('/api/updateCategory', require('./src/controllers/updateCategoryData'))

app.use('/api/inactiveAllDates', require('./src/controllers/inactiveAllDates'))

app.use('/api/organizer-review', require('./src/controllers/organizerReview'))

app.use('/api/trip-review', require('./src/controllers/tripReview'))

app.use('/api/validateExistingData', require('./src/controllers/validateExistingData'))

app.use('/api/complete-trip', require('./src/controllers/complete-trip'))

app.use('/api/placesSearch', require('./src/controllers/placesSearch'))

app.use('/api/stats', require('./src/controllers/stats'))

app.use('/api/places', require('./src/controllers/places'))

app.use('/api/upcomingtrip', require('./src/controllers/upcomingtrip'))

app.use('/api/cancelTrip', require('./src/controllers/cancelTrip'))

app.use('/api/pendingTrips', require('./src/controllers/pendingTrips'))

app.use('/api/completedTrips', require('./src/controllers/completedTrips'))

app.use('/api/notifications', require('./src/controllers/notifications'))

app.use("/api/bookingDetails", require("./src/controllers/bookingDetails"))

app.use('/api/otp', require('./src/controllers/otp'))

app.use('/api/upload', require('./src/controllers/upload'))

app.use('/api/quote', require('./src/controllers/quote'))

app.use('/api/refund', require('./src/controllers/refunds'))

const port = process.env.PORT || 3000;
app.listen(port);