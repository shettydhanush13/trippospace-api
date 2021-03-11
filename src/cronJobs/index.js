const cron = require("node-cron");
const { bookmarkInfo } = require("./bookmarkInfo");
const { refundRequest } = require("./cancellation");
const { organizerPayouts } = require("./organizerPayouts")
const { organizerDailyReports } = require("./organizerDailyReports")

let timezone = {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }

cron.schedule(
  "30 1 * * *",
  () => {
    console.log(`Cron job function for bookmark info collection called`);
    bookmarkInfo();
  }, timezone
);

cron.schedule(
  "30 2 * * *",
  () => {
    console.log(`Cron job function for raising refund request to razorpay called`);
    refundRequest();
  }, timezone
);

cron.schedule(
  "30 3 * * *",
    () => {
      console.log(`Cron job function for organizer daily payouts`);
      organizerPayouts();
    }, timezone
  );

cron.schedule(
  "30 23 * * *",
    () => {
      console.log(`Cron job function for organizer daily reports`);
      organizerDailyReports();
    }, timezone
  );

module.exports = {
    bookmarkInfo,
    refundRequest,
    organizerPayouts,
    organizerDailyReports
};
