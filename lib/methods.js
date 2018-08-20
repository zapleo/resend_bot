const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./mtproto/methods');
const { isMegaGroup, isGroup } = require('./utils');
const { inviteLog } = require('./storage/index');
const inviteFactory = require('./invite_factory');
const { inviteToSuperGroup, inviteToGroup } = require('./invite_methods');

const getInfoFromGroup = function (chat, options) {
  if(isGroup(chat)) {
    return getFullChat(chat.id);
  }

  if(isMegaGroup(chat)) {
    let inputChannel = {
      _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash
    };
    return getParticipants(inputChannel, options);
  }
  return Promise.reject(new Error('Wrong chat type'));
};

const chatFilter = function(chats) {
  let res = chats.filter(function(chat) {
    return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
  });
  return res;
}

const userFilter = function(users) {
  let res = users.filter(function(user) {
    return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
  });
  return res;
}

const maxInvited = function(inviteLog, chat) {
  if(!inviteLog.invited_count)
    return false;

  if(isGroup(chat)) {
    return inviteLog.invited_count > chat.users.length; 
  }

  if(isMegaGroup(chat)) {
    return inviteLog.invited_count > chat.count;
  }
  return false;
}

const inviteUsers = async(from, to, limit = 300) => {
  let inviteLogProperties = {
    from_chat_id: from.id,
    to_chat_id: to.id
  };
  await inviteLog.updateOne(inviteLogProperties, { "invited_count": 0 }, {upsert: true, new: true});
  const iLog = await inviteLog.findOne(inviteLogProperties);
  var offset =  iLog ? iLog.invited_count : 0;
  var fromChat = await getInfoFromGroup(from, { limit: limit, offset: offset });
  var toChat = await getInfoFromGroup(to, { limit: limit, offset: 0 });
  while(true) {
    let result  = await getInfoFromGroup(to, { limit: limit, offset: toChat.users.length });
    if (result.users.length == 0 ) break;
    let i =  0 ;
    while (i < result.users.length){
      toChat.users.push(result.users[i]);
      i++;
    }
  }
  if(iLog && maxInvited(iLog, fromChat))
    return Promise.reject(new Error('You reached max invites'));
  var newUsers = userFilter(fromChat.users);
  var oldUsers = userFilter(toChat.users);
  var users = userFormater(newUsers, oldUsers);
  console.log("количество отфильтрованых пользователей " + users.length);

  if(isGroup(to)){
    return await inviteToGroup(from, to, users, inviteLogProperties);
  }
  if(isMegaGroup(to)) {
    return await inviteToSuperGroup(from, to, users, inviteLogProperties);
  }
}

const userFormater = function(newUser, old) {
  let i = 0;
  while(i < old.length) {
      let y = 0;
      while(y < newUser.length) {
        if(newUser[y].id == old[i].id) {
          newUser.splice(y, 1);
        } y++;
      } i++;
  }
  return newUser;
}

module.exports = {
  inviteUsers,
  getInfoFromGroup,
  chatFilter
};