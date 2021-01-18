const CancellationRequest = require('../models/cancellationRequest');
const log4js = require('log4js');
const logger = log4js.getLogger("users"); 

const refundRequest = async () => {
    logger.info("Cheese is Comté.");
    logger.error("Cheese is too ripe!");
    CancellationRequest.find({refunded:"false"}, async (err,requests) => {
        if(err) console.log(err)
        else console.log(requests)
    })
}

module.exports = {
    refundRequest
};
