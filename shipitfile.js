module.exports = shipit => {
	
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit);

  shipit.initConfig({
    shared: {
      files: [
        {
          path: 'lib/config/index.js',
          overwrite: false,
          chmod: '755',
        },
        {
          path: 'storage.json',
          overwrite: false,
          chmod: '755'
        }
      ],
    },
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