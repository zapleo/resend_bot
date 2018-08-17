const Message = require('telegram-api/types/Message');
const Keyboard = require('telegram-api/types/Keyboard');
const Question = require('telegram-api/types/Question');
const bot = require('./../resend_bot');
const { inviteLog } = require('./../storage/index');

bot.command('offset', function(message) {
  editOffset(message).then(result => {
    answer = new Message().text(result).to(message.from.id);
    bot.send(answer);
  });
});

const editOffset = async(messages) => {
  const q = new Question()
              .text('')
              .answers([['Изменить offset'], ['Посмотреть Offset']])
              .to(messages.from.id);
  bot.send(q).then(message => {
    console.log('Valid Answer:', message.text);
  }, message => {
    console.log('Invalid:', message.text);
  });
}