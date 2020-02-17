const EventEmitter = require('events')
const Auth = new EventEmitter()
process.log.users = {}

Auth.on('unauthorized', ({ _id, email, source }) => {
  console.log('It\'s running')
  if (!process.log.users[_id]) {
    process.log.users[_id] = {
      email,
      source,
      loginCount: 1
    } 

    console.log('Initiate:', process.log.users)
    return
  }

  process.log.users[_id].loginCount++
  if (process.log.users[_id].login > 4) {
    console.log('Sending email to the client')
    return
  }
})

Auth.on('authorized', _id => {
  delete process.log.users[_id] 
  console.log(process.log.users)
})

module.exports = Auth
