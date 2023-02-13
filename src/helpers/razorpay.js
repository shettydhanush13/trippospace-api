const { config } = require("../config");
const { id, secret, baseUrl } = config.razorPayConfig

const getRazorpayHeaders = () => {
    const basicAuth = 'Basic ' + Buffer.from(`${id}:${secret}`, 'binary').toString('base64')
    const headers = { headers : { Authorization: basicAuth } }
    return {
        headers,
        baseUrl
    }
}

module.exports = { getRazorpayHeaders }