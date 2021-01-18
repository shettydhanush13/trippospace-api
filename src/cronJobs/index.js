const cron = require("node-cron");
const { bookmarkInfo } = require("./bookmarkInfo");
const { refundRequest } = require("./cancellation");

let timezone = {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }

cron.schedule(
  "30 12 * * *",
  () => {
    console.log(`Cron job function for bookmark info collection called`);
    bookmarkInfo();
  }, timezone
);

cron.schedule(
    "*/1 * * * *",
    () => {
      console.log(`Cron job function for raising refund request to razorpay called`);
      refundRequest();
    }, timezone
  );

module.exports = {
    bookmarkInfo,
    refundRequest
};
