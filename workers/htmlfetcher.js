var downloadUrls = require('../helpers/archive-helpers').downloadUrls;
var CronJob = require('cron').CronJob;

new CronJob('0 * * * * *', function() {
  downloadUrls();
}, null, true, 'America/Los_Angeles');