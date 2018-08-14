const { sendCode, signIn } = require('./../mtproto/methods');
const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');

bot.command('auth', message => {
  auth(message).then(resp => {
    let msg = new Message().to(message.chat.id);
    if(resp.user) {
      msg = msg.text("Вы успешно вошли в систему \u{1F389}");
    } else {
      msg = msg.text("Попробуйте еще раз \u{1F503}");
    }         
    bot.send(msg);
  })
});

const auth = async(message) => {
  const answerPhone = await bot.askQuestion('Введите телефон  в формате (+380xxxxxxxx):', message);
  let phone = answerPhone.text;
  let resCode = await sendCode(phone);
  const answerCode = await bot.askQuestion('Введите полученый код:', message);
  let code =  answerCode.text;

  return await signIn(phone, code, resCode);
}

module.exports = auth;