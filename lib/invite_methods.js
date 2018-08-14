const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./mtproto/methods');
const { isMegaGroup, isGroup, sleep } = require('./utils');
const { inviteLog, History } = require('./storage/index');
const inviteFactory = require('./invite_factory');

const inviteCount = function(users) {
  let limit = 200;
  var inviteSize = users.length < limit ? users.length : limit;
  return inviteSize;
};

const inviteToGroup = async(from, to, users, inviteLogProperties) => {
  var i = fail = success = 0;
  while (i < inviteCount(users)) {
    try {
      let iFactory = new inviteFactory(to, users[i]);
      await iFactory.toGroup();
      success++;
    } catch(e) {
      fail++;
    }
    await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": 1 } }, {upsert: true, new: true});
    i++;
  }
  return await Promise.resolve({"success": success, "fail": fail, "all": inviteCount(users) });
}

var superGroupInputUsers = function(users) {
  var i = 0;
  let inputUsers = [];

  while(i < inviteCount(users)) {
    let inputUser = {
      _: 'inputUser',
      user_id: users[i].id,
      access_hash: users[i].access_hash
    };
    inputUsers.push(inputUser);
    i++;
  }

  return inputUsers;
}

const inviteToSuperGroup = async(from, to, users, inviteLogProperties) => {
  var i = fail = success = 0;
  
  var inputUsers = superGroupInputUsers(users);
  
  while(i < inviteCount(users)) {
    console.log([inputUsers[i]]);
    let iFactory = new inviteFactory(to, [inputUsers[i]]);
    
    try {
      var updates = await iFactory.toMegaGroup();
      console.log("logUpdate", updates);
      success++;
    } catch(e) {
      fail++;
      console.log(e.message);
    }
    i++;
  }
  
  await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": ( inputUsers.length) } }, {upsert: true, new: true});
  
  if(success != 0 ) {
    History.create({ inviteCount: success, from_chat_name: from.title, to_chat_name: to.title });
  }
  return await Promise.resolve({"success": success, "fail": fail, "all": inputUsers.length });
}

module.exports = {
  inviteToSuperGroup,
  inviteToGroup
};