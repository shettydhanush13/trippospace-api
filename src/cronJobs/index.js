const cron = require("node-cron");
const { bookmarkInfo } = require("./bookmarkInfo");
const { settlement } = require('./pendingSettlements')
const { organizerDailyReports } = require('./organizerDailyReports')

let timezone = {
  scheduled: true,
  timezone: "Asia/Kolkata",
}

// cron.schedule(
//   "30 1 * * *",
//   () => {
//     console.log(`Cron job function for bookmark info collection called`);
//     bookmarkInfo();
//   }, timezone
// );

// cron.schedule(
//   "*/1 * * * *",
//     () => {
//       console.log(`Cron job function for pending amount settlement`);
//       settlement();
//     }, timezone
//   );

// cron.schedule(
//   "*/2 * * * *",
//     () => {
//       console.log(`Cron job function to generate daily reports`);
//       organizerDailyReports();
//     }, timezone
//   );
