module.exports = shipit => {
	
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/home/deploy/resend_bot',
      repositoryUrl: 'https://github.com/zapleo/resend_bot.git',
    },
    staging: {
      servers: 'deploy@159.253.22.188',
    },
  });

  shipit.blTask('start_server', function () {
    return shipit.remote( "cd /home/deploy/resend_bot/current && forever start bin/run");
  });
}