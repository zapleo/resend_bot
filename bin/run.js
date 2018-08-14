require('./../lib/commands');
require('./../lib/resend_observer');
const cron = require("node-cron");
const { TestFunc } = require('./../lib/commands/help');

// cron.schedule("10 * * * * *", function() {
//   TestFunc();
// });

