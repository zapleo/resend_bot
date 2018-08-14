const { getChats } = require('./../mtproto/methods');
const { Publisher } = require('./../storage/index');
const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');

bot.command('list', function(message) {
  list().then(publishers => {
    if(publishers.length == 0) {
      answer = new Message().text('У вас  нет сзязаных чатов для пересылки \nВведите /add для добавления.').to(message.from.id);
    } else {
      answer = new Message().html().text("<b>Это список ваших связаных чатов:</b>\n" +  publishers.join('\n')).to(message.from.id);
    }
    bot.send(answer);
  });
});

const list = async() => {
  let chats = await getChats();
  let publishers = await Publisher.find({}).exec();
  if(publishers.length == 0) {
    return publishers;
  }
  return listMap(chats, publishers);
}

const listMap = function(chats, publishers) {
  const res = publishers.map(publisher => {
    let from_chat = chats.find(chat => chat.id === parseInt(publisher.from_chat));
    let to_chat = chats.find(chat => chat.id === parseInt(publisher.to_chat));
    console.log(from_chat);
    console.log(to_chat);
    return from_chat.title + " \u{1F51B} " + to_chat.title;
  });
  return res;
}

module.exports = list;