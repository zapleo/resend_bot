const { getChats } = require('./../mtproto/methods');
const { Publisher } = require('./../storage');
const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');
const Question = require('telegram-api/types/Question');

bot.command('drop', message => {
  drop(message).then(drop => {
    var answer = new Message().text('Пересылка удалена \u{26A0}').to(message.from.id);
    bot.send(answer);
  })
});

const drop = async(message) => {
  const chats = await getChats();
  let publishers = await Publisher.find({}).exec();
  
  if(publishers.length == 0) 
    return Promise.resolve(publishers);

  let pubList = publisherList(publishers, chats);

  const selectPub = new Question({
    text: 'Выберите пересылку для удаления:',
    answers: publisherFilter(pubList)
  });
   
  const selectedPub = await bot.askKeyboardQuestion(selectPub, message);
  let publisher = pubList.find(publisher => publisher.title === selectedPub.text);
  
  return await Publisher.remove({_id : publisher.id});
}

const publisherList = function(publishers, chats) {
  let pubList = [];

  publishers.forEach(function(publisher, index) {
    var from_chat = chats.find(chat => chat.id === parseInt(publisher.from_chat));
    var to_chat = chats.find(chat => chat.id === parseInt(publisher.to_chat));
    pubList.push({id: publisher.id, title: from_chat.title + " \u{1F51B} " + to_chat.title });
  });
 
  return pubList;
}

const publisherFilter = function(pubList) {
  return pubList.map((publisher, index) => {
    return new Array(publisher.title);
  });
}

module.exports = drop;