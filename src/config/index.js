const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
    logConfig : {
        appenders: { 
            organizers : { type: "file", filename: "logs/organizers.log" },
            users : { type: "file", filename: "logs/users.log" },
        },
        categories: { default : { appenders: ["users"], level: "debug"} , organizers : { appenders: ["organizers"], level: "debug" } }
    },
    mongoConfig : {
        uri : `mongodb+srv://${process.env.mongoUser}:${encodeURIComponent(process.env.mongoPassword)}@cluster0.ejkuv.mongodb.net/${process.env.mongoCluster}?retryWrites=true&w=majority`
    },
    s3config : { 
        region: process.env.AWSregion, 
        accessKeyId: process.env.AWSaccessKeyId, 
        secretAccessKey: process.env.AWSsecretAccessKey
    },
    razorPayConfig : {
        id : process.env.razorpayId,
        secret : process.env.razorPaySecret,
        baseUrl : "https://api.razorpay.com/v1"
    },
    twillioConfig : {
        accountSid : process.env.twillioAccountSid,
        authToken : process.env.twillioAuthToken,
        servicesId : process.env.twillioServicesId
    },
    sendGrid : {
        apiKey : process.env.sendGridApiKey
    },
    organizerCommissions : {
        "5dedd09ef2d0210017c99497" : {
            commission : 10,
            refund : {
                0: 0,
                1 : 50,
                7 : 100,
            }
        }
    },
    cancellationPolicy : {
        2 : Math.floor(100/50),
        7 : Math.floor(100/100),
    }
}

module.exports = { config };