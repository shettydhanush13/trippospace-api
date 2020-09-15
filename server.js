const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
// mongoose.connect('mongodb://heroku_4bnf62cl:659mqm9veus9q1rurnobmbkq93@ds229088.mlab.com:29088/heroku_4bnf62cl');
let password = encodeURIComponent("5$Recieved")
const uri = "mongodb+srv://dhanush:" + password +"@cluster0.ejkuv.mongodb.net/trippospace?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
console.log(mongoose.version);
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

const path = require('path');
const { urlencoded } = require('body-parser');
app.use(express.static(path.join(__dirname,'public')))

app.use('/api/trip', require('./api/tripCRUD'))

app.use('/api/auth', require('./api/Auth'))

app.use('/api/tripCategory', require('./api/category'))

app.use('/api/my-trips', require('./api/completedTripCRUD'))

app.use('/api/shopping', require('./api/shoppingItemsData'))

app.use('/api/multi-trip', require('./api/MutipleTripsUpdate'))

app.use('/api/from', require('./api/getTripFromDepartureCity'))

app.use('/api/gift', require('./api/giftCard'))

app.use('/api/organizer', require('./api/organizerCRUD'))

app.use('/api/teeOrder', require('./api/teeOrder'))

app.use('/api/cart', require('./api/cartData'))

app.use('/api/inactive', require('./api/getInactiveTrips'))

app.use('/api/bookmark', require('./api/bookmarkTrip'))

app.use('/api/customer', require('./api/customerMaintenance'))

app.use('/api/user', require('./api/userCRUD'))

app.use('/api/updateCategory', require('./api/updateCategoryData'))

app.use('/api/inactiveAllDates', require('./api/inactiveAllDates'))

app.use('/api/organizer-review', require('./api/organizerReview'))

app.use('/api/trip-review', require('./api/tripReview'))

app.use('/api/validateExistingData', require('./api/validateExistingData'))

app.use('/api/complete-trip', require('./api/complete-trip'))

app.use('/api/placesSearch', require('./api/placesSearch'))

app.use('/api/stats', require('./api/stats'))

app.use('/api/places', require('./api/places'))

app.use('/api/upcomingtrip', require('./api/upcomingtrip'))

app.use('/api/pendingTrips', require('./api/pendingTrips'))

app.use('/api/completedTrips', require('./api/completedTrips'))

app.use('/api/notifications', require('./api/notifications'))

app.use('/api/otp', require('./api/otp'))

app.use('/api/upload', require('./api/upload'))

app.use('/api/skillospace', require('./api/skillospace'))

const port = process.env.PORT || 3000;
app.listen(port);