const bot = require('./../resend_bot');
const Message = require('telegram-api/types/Message');

const { getFullUser } = require('./../mtproto/methods');

bot.command('user', function(message) {
  getFullUser({_: 'inputUserSelf'}).then(data => {
    answer = new Message().html().text("Current user: " + data.user.username).to(message.from.id);
    bot.send(answer);
  });
});