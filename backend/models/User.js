const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    trim: true,
    required: [true, REQUIRED_ID],
    match: [REGEX_ID, INVALID_ID]
  },
  password: {
    type: String,
    trim: true,
    required: [true, REQUIRED_PASSWORD]
  },
  name: {
    type: String,
    trim: true,
    required: [true, REQUIRED_NAME],
    match: [REGEX_NAME, INVALID_NAME]
  },
  nickName: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('User', userSchema);
