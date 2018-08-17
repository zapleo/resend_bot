const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./mtproto/methods');
const { isMegaGroup, isGroup, sleep, parseMtProtoErorr } = require('./utils');
const { inviteLog, History } = require('./storage/index');
const inviteFactory = require('./invite_factory');


const inviteCount = function(users) {
  let limit = 200;
  var inviteSize = users.length < limit ? users.length : limit;
  return inviteSize;
};

const inviteToGroup = async(from, to, users, inviteLogProperties) => {
  var i = success = 0;
  var fails = [];

  while (i < inviteCount(users)) {
    let iFactory = new inviteFactory(to, users[i]);
    try {
      await iFactory.toGroup();
      success++;
    } catch(e) {
      fails.push(users[i].username +': ' + parseMtProtoErorr(e.message));
    }
    await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": 1 } }, {upsert: true, new: true});
    i++;
  }
  return await Promise.resolve({"success": success, "fails": fails, "all": inviteCount(users) });
}

Array.prototype.each_slice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

const superGroupInputUsers = function(users) {
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
  var i = success = 0;
  var fails = [];
  var inputUsers = superGroupInputUsers(users);

  // inputUsers.each_slice(10, function(userSlice) {
  //   console.log(userSlice)

  //     let iFactory = new inviteFactory(to, userSlice);
      
  //     iFactory.toMegaGroup().then(data => {
  //       success++;
  //       console.log(data);
  //     }).catch(e => {
  //       fail++;
  //       console.log(e.message);
  //     });
  // });
  
  while(i < inviteCount(users)) {
    await sleep(3000);
    let iFactory = new inviteFactory(to, [inputUsers[i]]);
    
    try {
      await iFactory.toMegaGroup();
      success++;
    } catch(e) {

      let username = users[i] ? users[i].username : 'not defined';
      fails.push(username +': ' + parseMtProtoErorr(e.message));
    }
    i++;
  }
  
  await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": ( inputUsers.length) } }, {upsert: true, new: true});
  
  if(success != 0 ) {
    History.create({ inviteCount: success, from_chat_name: from.title, to_chat_name: to.title });
  }
  return await Promise.resolve({"success": success, "fails": fails, "all": inputUsers.length });
}

module.exports = {
  inviteToSuperGroup,
  inviteToGroup
};