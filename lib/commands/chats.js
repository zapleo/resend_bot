const { getChats } = require('./../mtproto/methods');
const { chatFilter } = require('./../methods');

const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');


bot.command('chats', message => {
  chats().then(chatList => {
    if(chatList.length == 0) {
      answer = new Message().text('Вы не состоите не в одной ГРУППЕ или СУПЕРГРУППЕ').to(message.from.id);
    } else {
      answer = new Message().text("Это ваш список групп \u{1F4C4} \n" + chatList.join('\n')).to(message.from.id);
    }
    bot.send(answer)
  });
});

const chats = async() => {
  let chats = await getChats();

  let chatTitles = chatFilter(chats).map(chat => {
    return "\u{25FB} " + chat.title;
  });
  return chatTitles.unique();
}

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

module.exports = chats;