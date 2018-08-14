const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');
const { History } = require('./../storage/index');


bot.command('history', function(message) {
	resultFormater().then(result => {
		answer = new Message().html().text(result.join('\n')).to(message.from.id);
    bot.send(answer);
  });

});

const resultFormater = async() => {
	let	result = [];
	let AllHistory = await History.find({});
	let i = 0;
	if (AllHistory != []) {
		while(i < AllHistory.length) {
			result.push('<b>Добавлено пользователей: </b>' + AllHistory[i].inviteCount + " \u{1F46A}\nИз " 
							+ AllHistory[i].from_chat_name + "\nВ " 
							+ AllHistory[i].to_chat_name + "\n" + AllHistory[i].createdAt.toDateString() + "\n");
			i++;
		}
		return result;
	}
	result = ['истории еще нет ', ''];
	return result;

	// History.remove({}, function(err) {
 //            if (err) {
 //                console.log(err)
 //            } else {
 //                console.log('success');
 //            }
 //        }
 //    );
 // 	History.findOneAndRemove({'inviteCount' : 0}, function (err,offer){
 //        console.log(offer);
 //      });
}

