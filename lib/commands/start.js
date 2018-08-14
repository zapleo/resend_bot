const bot = require('./../resend_bot');
const Message = require('telegram-api/types/Message');

bot.command('start', function(message) {
  var answer = new Message().text('Привет, теперь я буду твоим ботом помощником  для пересылки сообщений и добавления пользователей в группы.').to(message.from.id);
  bot.send(answer);
});