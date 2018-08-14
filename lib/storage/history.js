var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
  inviteCount: {
    type: Number,
    require: false,
    default: 0
  },
  from_chat_name: {
    type: String,
    require: true
  },
  to_chat_name: {
    type: String,
    require: true
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('History', HistorySchema);