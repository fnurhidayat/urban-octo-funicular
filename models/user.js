const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var validateEmail = function(email) {
  var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
  return re.test(email)
};

const userSchema = new Schema({
  name: {
    type: 'string',
    required: true
  },
  image: {
    type: 'string',
    optional: true
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validateEmail, 'Invalid email format!']
  },
  password: {
    type: 'string',
    required: true
  }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
