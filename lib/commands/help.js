const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');

bot.command('help', function(message) {
  let commands = new Message().html().text("<b> Список команд для управления ботом. </b> \n" +
  								"\u{27A1} /invite - Пригласить из одного чата в другой.\n" + 
									"\u{27A1} /chats - Список ваших чатов. \n" +
									"\u{27A1} /list - Список ваших чатов для пересилки сообщения из одного в другой. \n" +
									"\u{27A1} /add - Добавить связь каналов для пересылки.  \n" +
									"\u{27A1} /drop - Удалить связь каналов для пересылки. \n" + 
									"\u{27A1} /history - история добавлений \n" + 
									"\u{27A1} /auth - Пойдключить свой аккаунт к боту.").to(message.from.id);
  bot.send(commands);
  
});

const TestFunc = function test() {
	console.log('its good');
}

module.exports = { TestFunc }