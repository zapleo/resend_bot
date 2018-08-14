const { getChats } = require('./../mtproto/methods');
const { inviteUsers, chatFilter, uniqArray} = require('./../methods');
const Question = require('telegram-api/types/Question');
const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');

bot.command('invite', function(message) {
  invite(message).then(result => {
    let response = new Message().text("Успешно: " + result.success + " Неуспешно:" + result.fail + "Всего: "+ result.all).to(message.from.id);
    bot.send(response);
  })
});

const invite = async(message) => {
  const chats = await getChats();
  var  filteredChats = chatFilter(chats);
  
  const selectFromInvite = new Question({
    text: 'Выберите группу из которой добавлять пользователей ',
    answers: fromChatTitles(filteredChats)
  });
  const selectedFromInvite = await bot.askKeyboardQuestion(selectFromInvite, message);
  const fromGroup = filteredChats.find(chat => chat.title === selectedFromInvite.text);

  const selectToInvite = new Question({
    text: 'Выберите группу в которую добавлять пользователей',
    answers: toChatTitles(filteredChats, fromGroup)
  });
  
  const selectedToInvite = await bot.askKeyboardQuestion(selectToInvite, message).then(result => { 
    bot.send(new Message().text("\u{231B} Подождите идет добавление.").to(message.from.id));
    return result;
  });
  const toGroup = chats.find(chat => chat.title === selectedToInvite.text);
  return await inviteUsers(fromGroup, toGroup);
}

const fromChatTitles = function(chats) {
  return chats.map(chat => {
    return new Array(chat.title);
  });
}

const toChatTitles = function(chats, from_chat) {
  return chats.map(chat => {
    if(chat.id != from_chat.id)
      return new Array(chat.title);
    }).filter(function(chat) {
      return chat;
  });
}

module.exports = invite;