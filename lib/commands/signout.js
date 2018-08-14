const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');
const fs = require('fs');
var appRoot = require('app-root-path');


bot.command('signout', function(message) {
	logOut().then(result => {
    answer = new Message().text(result).to(message.from.id);
  	bot.send(answer);
  })	
});


const logOut = async() => {
  fs.unlink(appRoot + "/storage.json", function(err){
    if (err) {
      console.log(err);
      return 'Ошибка, попробуйте еще !!';
    } else {
      console.log("Файл удалён");
      return 'Вы вышли из системы !!'
    }
	});
}