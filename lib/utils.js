var isMegaGroup = function(chat) {
  if(chat._ == 'channel' && chat.hasOwnProperty('megagroup')) {
    return true;
  }
  return false
}

var isGroup = function(chat) {
  if(chat._ == 'chat' && !chat.hasOwnProperty('migrated_to')) {
    return true;
  }
  return false;
}

var isChannel = function(chat) {
  if(chat._ == 'channel' && !chat.hasOwnProperty('megagroup')) {
    return true;
  }
  return false;
}

var getChatId = function(chat_type, chat_id) {
  if(chat_type == "chat"){
    return -Math.abs(chat_id);
  } else if(chat_type == "channel") {
    return parseInt('-100' + chat_id);   
  }
};

Array.prototype.eachSlice = function (size) {
  this.arr = [];
  for (let i = 0, l = this.length; i < l; i += size){
    this.arr.push(this.slice(i, i + size))
  }
  return this.arr;
};

var sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const parseMtProtoErorr = function(message) {
  const regex = /([A-Z])\w+/gm;
  res = regex.exec(message);

  return res[0];
}

module.exports = {
  isMegaGroup,
  isGroup,
  isChannel,
  getChatId,
  sleep,
  parseMtProtoErorr
};